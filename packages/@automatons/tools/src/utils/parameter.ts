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

export const hasSchema =
  (param: OpenapiParameter): param is OpenapiParameter & { schema: OpenapiSchema } =>
    (param as Object).hasOwnProperty('schema');
export const hasContent =
  (param: OpenapiParameter): param is OpenapiParameter & { content: OpenapiMap<OpenapiPathMedia> } =>
    (param as Object).hasOwnProperty('content');
export const isPathParam =
  (param: OpenapiParameter): param is OpenapiParameterPath => param.in === 'path';
export const isQueryParam =
  (param: OpenapiParameter): param is OpenapiParameterQuery => param.in === 'query';
export const isHeaderParam =
  (param: OpenapiParameter): param is OpenapiParameterHeader => param.in === 'header';
export const isCookieParam =
  (param: OpenapiParameter): param is OpenapiParameterCookie => param.in === 'cookie';
