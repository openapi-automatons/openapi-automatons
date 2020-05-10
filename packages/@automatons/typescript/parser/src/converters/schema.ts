import {SchemaCommon} from "../types";
import {OpenapiSchema} from "@automatons/tools/dist";

export const convertSchema = (schema: OpenapiSchema): SchemaCommon => ({
  description: schema.description,
  nullable: schema.nullable,
  readOnly: schema.readOnly,
  writeOnly: schema.writeOnly,
  deprecated: schema.deprecated,
  examples: schema.examples,
  defaultValue: schema.default,
});
