import {Openapi, OpenapiMap, OpenapiSchema} from "@automatons/tools/dist";
import {pascalCase} from "change-case";
import {convertAllOf} from "../converters/allOf";
import {convertArray} from "../converters/array";
import {convertModel} from "../converters/model";
import {convertNumber} from "../converters/number";
import {convertObjectSchema} from "../converters/object";
import {convertOneOf} from "../converters/oneOf";
import {convertSchemaModel} from "../converters/schema/model";
import {convertString} from "../converters/string";
import {Model, Schema} from "../types";
import {isAllOf, isArray, isInteger, isNumber, isObject, isOneOf, isRef, isString} from "../utils";

// TODO ref url時の対応
type NamedSchema = { title: string, schema: OpenapiSchema };
export default class ModelParser {
  private openapi: Openapi;

  constructor(openapi: Openapi) {
    this.openapi = openapi;
  }

  public parse(): Model[] {
    return this.extract(this.convertNamed(this.openapi.components?.schemas));
  }

  private extract(schemas: NamedSchema[]): Model[] {
    return schemas
      .map(({title, schema}) => {
        if (isString(schema)) {
          return convertModel(title, convertString(schema));
        } else if (isNumber(schema) || isInteger(schema)) {
          return convertModel(title, convertNumber(schema))
        } else if (isArray(schema)) {
          if (schema.items) {
            const {schema: shm, models, imports} =
              this.extractSchema(pascalCase([title, 'Item'].join(' ')), schema.items);
            return [convertModel(title, convertArray(schema, shm), imports), ...models];
          }
          return [convertModel(title, convertArray(schema))];
        } else if (isObject(schema)) {
          const models: Model[] = [];
          const imports: Model[] = [];
          const propertySchemas = schema.properties;
          const properties = propertySchemas && Object.keys(propertySchemas)
            .map(key => {
              const extractSchema = this.extractSchema(pascalCase([title, key].join(' ')), propertySchemas[key]);
              models.push(...extractSchema.models);
              imports.push(...(extractSchema.imports ?? []));
              return {name: key, required: schema.required?.includes(key) ?? false, schema: extractSchema.schema}
            });
          return [convertModel(title, convertObjectSchema(schema, properties), imports), ...models]
        } else if (isAllOf(schema)) {
          const {models, schemas: shms, imports} = schema.allOf.map(
            (item, index) => this.extractSchema(pascalCase([title, index].join(' ')), item))
            .reduce<{ schemas: Schema[], models: Model[], imports: Model[] }>(
              (pre, cur) =>
                ({
                  schemas: [...pre.schemas, cur.schema],
                  models: [...pre.models, ...cur.models],
                  imports: [...pre.imports, ...(cur.imports ?? [])]
                }),
              {schemas: [], models: [], imports: []});
          return [convertModel(title, convertAllOf(schema, shms), imports), ...models];
        } else if (isOneOf(schema)) {
          const {models, schemas: shms, imports} = schema.oneOf.map(
            (item, index) => this.extractSchema(pascalCase([title, index].join(' ')), item))
            .reduce<{ schemas: Schema[], models: Model[], imports: Model[] }>(
              (pre, cur) =>
                ({
                  schemas: [...pre.schemas, cur.schema],
                  models: [...pre.models, ...cur.models],
                  imports: [...pre.imports, ...(cur.imports ?? [])]
                }),
              {schemas: [], models: [], imports: []});
          return [convertModel(title, convertOneOf(schema, shms), imports), ...models]
        } else if (isRef(schema)) {
          const [, first, next, third] = schema.$ref.split('/');
          const refSchema: OpenapiSchema | undefined = (this.openapi as any)[first]?.[next]?.[third];

          if (!refSchema) throw new Error('Not found Reference');

          const ref = convertSchemaModel(third, refSchema);
          return convertModel(title, ref, [convertModel(third, ref)]);
        }
        throw new Error(`Unknown type\n${JSON.stringify(schema, undefined, 2)}`);
      }).flat();
  }

  private extractSchema(title: string, schema: OpenapiSchema): { schema: Schema, models: Model[], imports?: Model[] } {
    if (isString(schema)) {
      if (schema.title) {
        const modelSchema = convertSchemaModel(schema.title ?? title, schema);
        const models = [convertModel(schema.title ?? title, convertString(schema))];
        return {schema: modelSchema, models, imports: models};
      }
      return {schema: convertString(schema), models: []};
    } else if (isNumber(schema) || isInteger(schema)) {
      if (schema.title) {
        const modelSchema = convertSchemaModel(schema.title ?? title, schema);
        const models = [convertModel(schema.title ?? title, convertNumber(schema))];
        return {schema: modelSchema, models, imports: models};
      }
      return {schema: convertNumber(schema), models: []};
    } else if (isArray(schema)) {
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
    } else if (isObject(schema)) {
      const modelSchema = convertSchemaModel(schema.title ?? title, schema);
      const models = this.extract([{title: schema.title ?? title, schema}]);
      return {
        schema: modelSchema,
        models,
        imports: [convertModel(schema.title ?? title, modelSchema)]
      };
    } else if (isAllOf(schema)) {
      const modelSchema = convertSchemaModel(schema.title ?? title, schema);
      const models = this.extract([{title: schema.title ?? title, schema}]);
      return {
        schema: modelSchema,
        models,
        imports: [convertModel(schema.title ?? title, modelSchema)]
      };
    } else if (isOneOf(schema)) {
      const modelSchema = convertSchemaModel(schema.title ?? title, schema);
      const models = this.extract([{title: schema.title ?? title, schema}]);
      return {
        schema: modelSchema,
        models,
        imports: [convertModel(schema.title ?? title, modelSchema)]
      };
    } else if (isRef(schema)) {
      const [, , , name] = schema.$ref.split('/');
      const model = schema.title ?? name ?? title;
      const modelSchema = convertSchemaModel(model, schema);
      return {
        schema: modelSchema,
        models: [],
        imports: [convertModel(model, modelSchema)]
      };
    }
    throw new Error(`Unknown type\n${JSON.stringify(schema, undefined, 2)}`);
  }

  private convertNamed(schemas: OpenapiMap<OpenapiSchema> = {}, prefix: string = ''): NamedSchema[] {
    return Object.keys(schemas)
      .map(key => ({title: pascalCase(schemas[key].title ?? [prefix, key].join(' ')), schema: schemas[key]}));
  }
}
