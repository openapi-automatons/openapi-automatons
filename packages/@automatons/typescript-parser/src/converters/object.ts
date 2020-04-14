import {OpenapiSchemaObject} from "@automatons/tools";
import {ObjectSchema, Property} from "../types";
import {convertSchema} from "./schema";

export const convertObjectSchema = (schema: OpenapiSchemaObject, properties?: Property[]): ObjectSchema => ({
  type: 'object',
  ...convertSchema(schema),
  properties
});
