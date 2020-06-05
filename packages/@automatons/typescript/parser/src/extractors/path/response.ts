import {Method, OpenapiMap, OpenapiPathResponse, OpenapiReference, referenceSchema} from "@automatons/tools/dist";
import {extractStatus} from "./status";
import {extractMediaType} from "./mediaType";
import {extractSchema, ExtractSchemaResult} from "../schema";
import {PathContext} from "./type";

export const extractResponse = async (schema: OpenapiMap<OpenapiPathResponse | OpenapiReference>, method: Method, context: PathContext): Promise<ExtractSchemaResult | void> => {
  const status = extractStatus(schema);
  const response = await referenceSchema(schema[status], context);
  const content = response.content;
  if (!content) return;
  const mediaType = extractMediaType(content);
  const resSchema = content[mediaType].schema;
  if (!resSchema) return;
  return extractSchema([...context.path.split('/'), method, 'Response'].join(' '),
    resSchema, context);
}
