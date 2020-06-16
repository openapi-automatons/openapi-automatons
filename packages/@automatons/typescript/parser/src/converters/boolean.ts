import {BooleanSchema} from "../types";
import {convertSchema} from "./schema";
import {OpenapiSchemaBoolean} from "@automatons/tools/dist";

export const convertBoolean = (schema: OpenapiSchemaBoolean): BooleanSchema => ({
  type: 'boolean',
  ...convertSchema(schema)
})
