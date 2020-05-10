import {OpenapiSchemaOneOf} from "@automatons/tools";
import {OneOfSchema, Schema} from "../types";
import {convertSchema} from "./schema";

export const convertOneOf = (schema: OpenapiSchemaOneOf, schemas: Schema[]): OneOfSchema => ({
  type: 'oneOf',
  ...convertSchema(schema),
  schemas,
});
