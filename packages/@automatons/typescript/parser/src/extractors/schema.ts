import {
  Openapi,
  OpenapiSchema,
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
import {convertArray} from "../converters/array";
import {convertModel} from "../converters/model";
import {convertNumber} from "../converters/number";
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
import {extractModel} from "./model";

export type ExtractSchemaResult = { schema: Schema, models: Model[], imports?: Model[] };

// TODO title openapi => context
export const extractSchema = (title: string, schema: OpenapiSchema,
                              openapi: Openapi): ExtractSchemaResult => {
  if (isSchemaString(schema)) {
    return extractStringSchema(title, schema);
  } else if (isSchemaNumber(schema) || isSchemaInteger(schema)) {
    return extractNumberSchema(title, schema);
  } else if (isSchemaArray(schema)) {
    return extractArraySchema(title, schema, openapi);
  } else if (isSchemaObject(schema)) {
    return extractObjectSchema(title, schema, openapi);
  } else if (isSchemaAllOf(schema)) {
    return extractAllOfSchema(title, schema, openapi);
  } else if (isSchemaOneOf(schema)) {
    return extractOneOfSchema(title, schema, openapi);
  } else if (isSchemaRef(schema)) {
    return extractRefSchema(title, schema);
  }
  throw new Error(`Unknown type\n${JSON.stringify(schema, undefined, 2)}`);
}

export const extractStringSchema = (title: string, schema: OpenapiSchemaString) => {
  if (schema.title) {
    const modelSchema = convertSchemaModel(schema.title ?? title, schema);
    const models = [convertModel(schema.title ?? title, convertString(schema))];
    return {schema: modelSchema, models, imports: models};
  }
  return {schema: convertString(schema), models: []};
}

export const extractNumberSchema = (title: string, schema: OpenapiSchemaNumber | OpenapiSchemaInteger) => {
  if (schema.title) {
    const modelSchema = convertSchemaModel(schema.title ?? title, schema);
    const models = [convertModel(schema.title ?? title, convertNumber(schema))];
    return {schema: modelSchema, models, imports: models};
  }
  return {schema: convertNumber(schema), models: []};
}

export const extractArraySchema = (title: string, schema: OpenapiSchemaArray, openapi: Openapi) => {
  const models: Model[] = [];
  const imports: Model[] = [];
  let itemSchema = undefined;
  if (schema.items) {
    const {schema: shm, models: itemModels, imports: itemImports} =
      extractSchema(pascalCase([title, 'Item'].join(' ')), schema.items, openapi);
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

export const extractObjectSchema = (title: string, schema: OpenapiSchemaObject, openapi: Openapi) => {
  const modelSchema = convertSchemaModel(schema.title ?? title, schema);
  const {model, insides} = extractModel(schema.title ?? title, schema, openapi);
  return {
    schema: modelSchema,
    models: [model, ...insides],
    imports: [convertModel(schema.title ?? title, modelSchema)]
  };
}

export const extractAllOfSchema = (title: string, schema: OpenapiSchemaAllOf, openapi: Openapi) => {
  const modelSchema = convertSchemaModel(schema.title ?? title, schema);
  const {model, insides} = extractModel(schema.title ?? title, schema, openapi);
  return {
    schema: modelSchema,
    models: [model, ...insides],
    imports: [convertModel(schema.title ?? title, modelSchema)]
  };
}

export const extractOneOfSchema = (title: string, schema: OpenapiSchemaOneOf, openapi: Openapi) => {
  const modelSchema = convertSchemaModel(schema.title ?? title, schema);
  const {model, insides} = extractModel(schema.title ?? title, schema, openapi);
  return {
    schema: modelSchema,
    models: [model, ...insides],
    imports: [convertModel(schema.title ?? title, modelSchema)]
  };
}

export const extractRefSchema = (title: string, schema: OpenapiSchemaReference) => {
  const [, , , name] = schema.$ref.split('/');
  const model = schema.title ?? name ?? title;
  const modelSchema = convertSchemaModel(model, schema);
  return {
    schema: modelSchema,
    models: [],
    imports: [convertModel(model, modelSchema)]
  };
}
