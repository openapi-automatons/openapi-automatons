import {
  OpenapiMap,
  OpenapiParameter,
  OpenapiParameterCookie,
  OpenapiParameterHeader,
  OpenapiParameterPath,
  OpenapiParameterQuery,
  OpenapiPathMedia,
  OpenapiSchema
} from "../types";
import {isRef} from "./openapi";

export const hasSchema =
  (param: OpenapiParameter): param is OpenapiParameter & { schema: OpenapiSchema } =>
    (param as Object).hasOwnProperty('schema');
export const hasContent =
  (param: OpenapiParameter): param is OpenapiParameter & { content: OpenapiMap<OpenapiPathMedia> } =>
    (param as Object).hasOwnProperty('content');
export const isPathParam =
  (param: OpenapiParameter): param is OpenapiParameterPath => !isRef(param) && param.in === 'path';
export const isQueryParam =
  (param: OpenapiParameter): param is OpenapiParameterQuery => !isRef(param) && param.in === 'query';
export const isHeaderParam =
  (param: OpenapiParameter): param is OpenapiParameterHeader => !isRef(param) && param.in === 'header';
export const isCookieParam =
  (param: OpenapiParameter): param is OpenapiParameterCookie => !isRef(param) && param.in === 'cookie';
