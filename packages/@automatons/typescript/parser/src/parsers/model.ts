import {Openapi, OpenapiMap, OpenapiSchema} from "@automatons/tools";
import {
  HTTP_METHODS,
  Method,
  OpenapiPath,
  OpenapiPathResponse,
  OpenapiReference,
  OpenapiSchemaAllOf,
  OpenapiSchemaArray,
  OpenapiSchemaInteger,
  OpenapiSchemaNumber,
  OpenapiSchemaObject,
  OpenapiSchemaOneOf,
  OpenapiSchemaReference,
  OpenapiSchemaString
} from "@automatons/tools/dist";
import {pascalCase} from "change-case";
import deepmerge from 'deepmerge';
import {convertAllOf} from "../converters/allOf";
import {convertArray} from "../converters/array";
import {ArrayMap, convertMap} from "../converters/map";
import {convertModel} from "../converters/model";
import {convertNumber} from "../converters/number";
import {convertObjectSchema} from "../converters/object";
import {convertOneOf} from "../converters/oneOf";
import {convertSchemaModel} from "../converters/schemaModel";
import {convertString} from "../converters/string";
import {Model, Schema} from "../types";
import {insert} from "../utils/object";
import {isRef} from "../utils/openapi";
import {
  isSchemaAllOf,
  isSchemaArray,
  isSchemaInteger,
  isSchemaNumber,
  isSchemaObject,
  isSchemaOneOf,
  isSchemaRef,
  isSchemaString
} from "../utils/schema";

// TODO ref url時の対応
type NamedSchema = { title: string, schema: OpenapiSchema };
type ExtractModel = { model: Model, insides: Model[] };
type ModelMap = { models: Model[], map: object };
export default class ModelParser {
  private readonly openapi: Openapi;

  constructor(openapi: Openapi) {
    this.openapi = openapi;
  }

  public parse(): ModelMap {
    const componentModels = this.extract(this.convertNamed(this.openapi.components?.schemas));
    const {models, map} = this.extractApi();
    return {
      models: [...componentModels, ...models],
      map
    };
  }

  private extract(schemas: NamedSchema[]): Model[] {
    return schemas
      .map(({title, schema}) => {
        const {model, insides} = this.extractModel(schema, title);
        return [model, ...insides];
      }).flat();
  }

  private extractApi(): ModelMap {
    return convertMap(this.openapi.paths)
      .map(path => {
        return HTTP_METHODS.map((method: Method) =>
          this.extractApiMethod(path, method)).reduce(this.mergeModelMap, {models: [], map: {}})
      }).reduce(this.mergeModelMap, {models: [], map: {}})
  }

  private mergeModelMap(pre: ModelMap, cur: ModelMap): ModelMap {
    return {
      models: [...pre.models, ...cur.models],
      map: deepmerge(pre.map, cur.map)
    };
  }

  private extractApiMethod(path: ArrayMap<OpenapiPath>, method: Method): ModelMap {
    const models: Model[] = [];
    let map = {};
    convertMap<OpenapiPathResponse | OpenapiReference>(path.schema[method]?.responses)
      .forEach(response => {
        const responseSchema = response.schema;
        if (!isRef(responseSchema)) {
          convertMap(responseSchema.content)
            .forEach((content) => {
              const {schema: {schema: contentSchema}} = content;
              const schemaPath = [path.key, 'get', response.key, content.key];
              const title = pascalCase(schemaPath.join(' '));
              if (contentSchema && !isSchemaRef(contentSchema)) {
                const {model} = this.extractModel(contentSchema, title);
                models.push(model);
                map = insert(map, schemaPath, model);
              } else if (contentSchema && isSchemaRef(contentSchema)) {
                const {model} = this.extractRefModel(contentSchema, title, true);
                map = insert(map, schemaPath, model);
              }
            })
        }
      })
    return {models, map};
  }

  private extractModel(schema: OpenapiSchema, title: string): ExtractModel {
    if (isSchemaString(schema)) {
      return {model: convertModel(title, convertString(schema)), insides: []};
    } else if (isSchemaNumber(schema) || isSchemaInteger(schema)) {
      return {model: convertModel(title, convertNumber(schema)), insides: []};
    } else if (isSchemaArray(schema)) {
      return this.extractArrayModel(schema, title);
    } else if (isSchemaObject(schema)) {
      return this.extractObjectModel(schema, title);
    } else if (isSchemaAllOf(schema)) {
      return this.extractAllOfModel(schema, title);
    } else if (isSchemaOneOf(schema)) {
      return this.extractOneOfModel(schema, title);
    } else if (isSchemaRef(schema)) {
      return this.extractRefModel(schema, title);
    }
    throw new Error(`Unknown type\n${JSON.stringify(schema, undefined, 2)}`);
  }

  private extractRefModel(schema: OpenapiSchemaReference, title: string, priority: boolean = false): ExtractModel {
    const [, first, next, third] = schema.$ref.split('/');
    const refSchema: OpenapiSchema | undefined = (this.openapi as any)[first]?.[next]?.[third];

    if (!refSchema) throw new Error('Not found Reference');

    const ref = convertSchemaModel(third, refSchema);
    return {model: convertModel(priority ? third : title, ref, [convertModel(third, ref)]), insides: []};
  }

  private extractOfModel(schemas: OpenapiSchema[], title: string) {
    return schemas.map(
      (item, index) => this.extractSchema(pascalCase([title, index].join(' ')), item))
      .reduce<{ schemas: Schema[], models: Model[], imports: Model[] }>(
        (pre, cur) =>
          ({
            schemas: [...pre.schemas, cur.schema],
            models: [...pre.models, ...cur.models],
            imports: [...pre.imports, ...(cur.imports ?? [])]
          }),
        {schemas: [], models: [], imports: []});
  }

  private extractOneOfModel(schema: OpenapiSchemaOneOf, title: string) {
    const {models, schemas, imports} = this.extractOfModel(schema.oneOf, title);
    return {model: convertModel(title, convertOneOf(schema, schemas), imports), insides: models}
  }

  private extractAllOfModel(schema: OpenapiSchemaAllOf, title: string): ExtractModel {
    const {models, schemas, imports} = this.extractOfModel(schema.allOf, title);
    return {model: convertModel(title, convertAllOf(schema, schemas), imports), insides: models}
  }

  private extractObjectModel(schema: OpenapiSchemaObject, title: string): ExtractModel {
    const models: Model[] = [];
    const imports: Model[] = [];
    const propertySchemas = schema.properties;
    const properties = convertMap(propertySchemas)
      .map(({key, schema: propertySchema}) => {
        const extractSchema = this.extractSchema(pascalCase([title, key].join(' ')), propertySchema);
        models.push(...extractSchema.models);
        imports.push(...(extractSchema.imports ?? []));
        return {name: key, required: schema.required?.includes(key) ?? false, schema: extractSchema.schema}
      });
    return {model: convertModel(title, convertObjectSchema(schema, properties), imports), insides: models}
  }

  private extractArrayModel(schema: OpenapiSchemaArray, title: string): ExtractModel {
    if (schema.items) {
      const {schema: shm, models, imports} =
        this.extractSchema(pascalCase([title, 'Item'].join(' ')), schema.items);
      return {model: convertModel(title, convertArray(schema, shm), imports), insides: models}
    }
    return {model: convertModel(title, convertArray(schema)), insides: []};
  }

  private extractSchema(title: string, schema: OpenapiSchema): { schema: Schema, models: Model[], imports?: Model[] } {
    if (isSchemaString(schema)) {
      return this.extractStringSchema(schema, title);
    } else if (isSchemaNumber(schema) || isSchemaInteger(schema)) {
      return this.extractNumberSchema(schema, title);
    } else if (isSchemaArray(schema)) {
      return this.extractArraySchema(schema, title);
    } else if (isSchemaObject(schema)) {
      return this.extractObjectSchema(schema, title);
    } else if (isSchemaAllOf(schema)) {
      return this.extractAllOfSchema(schema, title);
    } else if (isSchemaOneOf(schema)) {
      return this.extractOneOfSchema(schema, title);
    } else if (isSchemaRef(schema)) {
      return this.extractRefSchema(schema, title);
    }
    throw new Error(`Unknown type\n${JSON.stringify(schema, undefined, 2)}`);
  }

  private extractStringSchema(schema: OpenapiSchemaString, title: string) {
    if (schema.title) {
      const modelSchema = convertSchemaModel(schema.title ?? title, schema);
      const models = [convertModel(schema.title ?? title, convertString(schema))];
      return {schema: modelSchema, models, imports: models};
    }
    return {schema: convertString(schema), models: []};
  }

  private extractNumberSchema(schema: OpenapiSchemaNumber | OpenapiSchemaInteger, title: string) {
    if (schema.title) {
      const modelSchema = convertSchemaModel(schema.title ?? title, schema);
      const models = [convertModel(schema.title ?? title, convertNumber(schema))];
      return {schema: modelSchema, models, imports: models};
    }
    return {schema: convertNumber(schema), models: []};
  }

  private extractArraySchema(schema: OpenapiSchemaArray, title: string) {
    const models: Model[] = [];
    const imports: Model[] = [];
    let itemSchema = undefined;
    if (schema.items) {
      const {schema: shm, models: itemModels, imports: itemImports} =
        this.extractSchema(pascalCase([title, 'Item'].join(' ')), schema.items);
      itemSchema = shm;
      models.push(...itemModels);
      imports.push(...(itemImports ?? []));
    }
    if (schema.title) {
      const modelSchema = convertSchemaModel(schema.title ?? title, schema);
      const model = convertModel(schema.title ?? title, convertArray(schema, itemSchema));
      return {schema: modelSchema, models: [model, ...models], imports: [...models]};
    }
    return {
      schema: convertArray(schema, itemSchema),
      models: models,
      imports
    };
  }

  private extractObjectSchema(schema: OpenapiSchemaObject, title: string) {
    const modelSchema = convertSchemaModel(schema.title ?? title, schema);
    const models = this.extract([{title: schema.title ?? title, schema}]);
    return {
      schema: modelSchema,
      models,
      imports: [convertModel(schema.title ?? title, modelSchema)]
    };
  }

  private extractAllOfSchema(schema: OpenapiSchemaAllOf, title: string) {
    const modelSchema = convertSchemaModel(schema.title ?? title, schema);
    const models = this.extract([{title: schema.title ?? title, schema}]);
    return {
      schema: modelSchema,
      models,
      imports: [convertModel(schema.title ?? title, modelSchema)]
    };
  }

  private extractOneOfSchema(schema: OpenapiSchemaOneOf, title: string) {
    const modelSchema = convertSchemaModel(schema.title ?? title, schema);
    const models = this.extract([{title: schema.title ?? title, schema}]);
    return {
      schema: modelSchema,
      models,
      imports: [convertModel(schema.title ?? title, modelSchema)]
    };
  }

  private extractRefSchema(schema: OpenapiSchemaReference, title: string) {
    const [, , , name] = schema.$ref.split('/');
    const model = schema.title ?? name ?? title;
    const modelSchema = convertSchemaModel(model, schema);
    return {
      schema: modelSchema,
      models: [],
      imports: [convertModel(model, modelSchema)]
    };
  }

  private convertNamed(schemas: OpenapiMap<OpenapiSchema> = {}, prefix: string = ''): NamedSchema[] {
    return convertMap(schemas)
      .map(({key, schema}) =>
        ({title: pascalCase(schema.title ?? [prefix, key].join(' ')), schema}));
  }
}
