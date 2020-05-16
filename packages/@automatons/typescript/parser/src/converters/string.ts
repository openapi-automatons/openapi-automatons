import {OpenapiSchemaString} from "@automatons/tools";
import {StringSchema} from "../types";
import {convertSchema} from "./schema";

export const convertString = (schema: OpenapiSchemaString): StringSchema => ({
  type: 'string',
  format: schema.format,
  enum: schema.enum ?? [],
  ...convertSchema(schema)
})
