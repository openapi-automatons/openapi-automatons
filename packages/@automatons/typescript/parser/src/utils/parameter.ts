import {
    OpenapiMap,
    OpenapiParameter,
    OpenapiParameterPath,
    OpenapiParameterQuery,
    OpenapiPathMedia,
    OpenapiSchema
} from "@automatons/tools";

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
