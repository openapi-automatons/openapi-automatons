import {
  OpenapiSchemaAllOf,
  OpenapiSchemaArray,
  OpenapiSchemaInteger,
  OpenapiSchemaNumber,
  OpenapiSchemaObject,
  OpenapiSchemaOneOf,
  OpenapiSchemaString
} from "@automatons/tools";
import {OpenapiReference} from "@automatons/tools/dist";

export const isString = (type: any): type is OpenapiSchemaString => type?.type === 'string';
export const isNumber = (type: any): type is OpenapiSchemaNumber => type?.type === 'number';
export const isInteger = (type: any): type is OpenapiSchemaInteger => type?.type === 'integer';
export const isObject = (type: any): type is OpenapiSchemaObject => type?.type === 'object';
export const isArray = (type: any): type is OpenapiSchemaArray => type?.type === 'array';
export const isAllOf = (type: any): type is OpenapiSchemaAllOf => type.hasOwnProperty('allOf');
export const isOneOf = (type: any): type is OpenapiSchemaOneOf => type.hasOwnProperty('oneOf');
export const isRef = (type: any): type is OpenapiReference => type.hasOwnProperty('$ref');
