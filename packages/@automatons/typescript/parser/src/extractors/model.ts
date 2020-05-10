import {
  Openapi,
  OpenapiSchema,
  OpenapiSchemaAllOf,
  OpenapiSchemaArray,
  OpenapiSchemaObject,
  OpenapiSchemaOneOf,
  OpenapiSchemaReference
} from "@automatons/tools/dist";
import {pascalCase} from "change-case";
import {convertAllOf} from "../converters/allOf";
import {convertArray} from "../converters/array";
import {convertMap} from "../converters/map";
import {convertModel} from "../converters/model";
import {convertNumber} from "../converters/number";
import {convertObjectSchema} from "../converters/object";
import {convertOneOf} from "../converters/oneOf";
import {convertSchemaModel} from "../converters/schemaModel";
import {convertString} from "../converters/string";
import {Model, Schema} from "../types";
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
import {extractSchema} from "./schema";

type ExtractModel = { model: Model, insides: Model[] };
// TODO title openapi => context
export const extractModel = (title: string, schema: OpenapiSchema, openapi: Openapi): ExtractModel => {
  if (isSchemaString(schema)) {
    return {model: convertModel(title, convertString(schema)), insides: []};
  } else if (isSchemaNumber(schema) || isSchemaInteger(schema)) {
    return {model: convertModel(title, convertNumber(schema)), insides: []};
  } else if (isSchemaArray(schema)) {
    return extractArrayModel(title, schema, openapi);
  } else if (isSchemaObject(schema)) {
    return extractObjectModel(title, schema, openapi);
  } else if (isSchemaAllOf(schema)) {
    return extractAllOfModel(title, schema, openapi);
  } else if (isSchemaOneOf(schema)) {
    return extractOneOfModel(title, schema, openapi);
  } else if (isSchemaRef(schema)) {
    return extractRefModel(title, schema, openapi);
  }
  throw new Error(`Unknown type\n${JSON.stringify(schema, undefined, 2)}`);
}

export const extractRefModel = (title: string, schema: OpenapiSchemaReference, openapi: Openapi): ExtractModel => {
  const [, first, next, third] = schema.$ref.split('/');
  const refSchema: OpenapiSchema | undefined = (openapi as any)[first]?.[next]?.[third];

  if (!refSchema) throw new Error('Not found Reference');

  const ref = convertSchemaModel(third, refSchema);
  return {model: convertModel(title, ref, [convertModel(third, ref)]), insides: []};
}

export const extractOfModel = (title: string, schemas: OpenapiSchema[], openapi: Openapi) => {
  return schemas.map(
    (item, index) => extractSchema(pascalCase([title, index].join(' ')), item, openapi))
    .reduce<{ schemas: Schema[], models: Model[], imports: Model[] }>(
      (pre, cur) =>
        ({
          schemas: [...pre.schemas, cur.schema],
          models: [...pre.models, ...cur.models],
          imports: [...pre.imports, ...(cur.imports ?? [])]
        }),
      {schemas: [], models: [], imports: []});
}

export const extractOneOfModel = (title: string, schema: OpenapiSchemaOneOf, openapi: Openapi) => {
  const {models, schemas, imports} = extractOfModel(title, schema.oneOf, openapi);
  return {model: convertModel(title, convertOneOf(schema, schemas), imports), insides: models}
}

export const extractAllOfModel = (title: string, schema: OpenapiSchemaAllOf, openapi: Openapi): ExtractModel => {
  const {models, schemas, imports} = extractOfModel(title, schema.allOf, openapi);
  return {model: convertModel(title, convertAllOf(schema, schemas), imports), insides: models}
}

export const extractObjectModel = (title: string, schema: OpenapiSchemaObject, openapi: Openapi): ExtractModel => {
  const models: Model[] = [];
  const imports: Model[] = [];
  const propertySchemas = schema.properties;
  const properties = convertMap(propertySchemas)
    .map(({key, schema: propertySchema}) => {
      const extractPropertySchema = extractSchema(pascalCase([title, key].join(' ')), propertySchema, openapi);
      models.push(...extractPropertySchema.models);
      imports.push(...(extractPropertySchema.imports ?? []));
      return {name: key, required: schema.required?.includes(key) ?? false, schema: extractPropertySchema.schema}
    });
  return {model: convertModel(title, convertObjectSchema(schema, properties), imports), insides: models}
}

export const extractArrayModel = (title: string, schema: OpenapiSchemaArray, openapi: Openapi): ExtractModel => {
  if (schema.items) {
    const {schema: shm, models, imports} =
      extractSchema(pascalCase([title, 'Item'].join(' ')), schema.items, openapi);
    return {model: convertModel(title, convertArray(schema, shm), imports), insides: models}
  }
  return {model: convertModel(title, convertArray(schema)), insides: []};
}
