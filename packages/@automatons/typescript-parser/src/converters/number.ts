import {OpenapiSchemaInteger, OpenapiSchemaNumber} from "@automatons/tools";
import {NumberSchema} from "../types";
import {convertSchema} from "./schema";

export const convertNumber = (schema: OpenapiSchemaNumber | OpenapiSchemaInteger): NumberSchema => ({
  type: "number",
  ...convertSchema(schema),
  enum: schema.enum ?? []
})
