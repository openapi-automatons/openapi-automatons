import {OpenapiSchemaArray} from "@automatons/tools";
import {ArraySchema, Schema} from "../types";
import {convertSchema} from "./schema";

export const convertArray = (schema: OpenapiSchemaArray, itemSchema?: Schema): ArraySchema => ({
  type: "array",
  ...convertSchema(schema),
  uniqueItems: schema.uniqueItems,
  minItems: schema.minItems,
  maxItems: schema.maxItems,
  items: itemSchema
});
