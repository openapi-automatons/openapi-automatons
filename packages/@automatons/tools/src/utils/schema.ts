import {
  OpenapiSchema,
  OpenapiSchemaAllOf,
  OpenapiSchemaArray, OpenapiSchemaBoolean,
  OpenapiSchemaInteger,
  OpenapiSchemaNumber,
  OpenapiSchemaObject,
  OpenapiSchemaOneOf,
  OpenapiSchemaReference,
  OpenapiSchemaString
} from "../types";

export const isSchemaString =
  (type: OpenapiSchema): type is OpenapiSchemaString => (type as OpenapiSchemaString).type === 'string';
export const isSchemaNumber =
  (type: OpenapiSchema): type is OpenapiSchemaNumber => (type as OpenapiSchemaNumber).type === 'number';
export const isSchemaInteger =
  (type: OpenapiSchema): type is OpenapiSchemaInteger => (type as OpenapiSchemaInteger).type === 'integer';
export const isSchemaBoolean =
  (type: OpenapiSchema): type is OpenapiSchemaBoolean => (type as OpenapiSchemaBoolean).type === 'boolean';
export const isSchemaObject =
  (type: OpenapiSchema): type is OpenapiSchemaObject => (type as OpenapiSchemaObject).type === 'object';
export const isSchemaArray =
  (type: OpenapiSchema): type is OpenapiSchemaArray => (type as OpenapiSchemaArray).type === 'array';
export const isSchemaAllOf =
  (type: OpenapiSchema): type is OpenapiSchemaAllOf => (type as Object).hasOwnProperty('allOf');
export const isSchemaOneOf =
  (type: OpenapiSchema): type is OpenapiSchemaOneOf => (type as Object).hasOwnProperty('oneOf');
export const isSchemaRef =
  (type: OpenapiSchema): type is OpenapiSchemaReference => (type as Object).hasOwnProperty('$ref');
