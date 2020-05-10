import {
  OpenapiMap,
  OpenapiParameter,
  OpenapiParameterPath,
  OpenapiPathMedia,
  OpenapiSchema
} from "@automatons/tools/dist";

export const hasSchema =
  (param: OpenapiParameter): param is OpenapiParameter & { schema: OpenapiSchema } =>
    (param as Object).hasOwnProperty('schema');
export const hasContent =
  (param: OpenapiParameter): param is OpenapiParameter & { content: OpenapiMap<OpenapiPathMedia> } =>
    (param as Object).hasOwnProperty('content');
export const isPathParam =
  (param: OpenapiParameter): param is OpenapiParameterPath => param.in === 'path';
