import {OpenapiSchema} from "@automatons/tools/dist";
import {pascalCase} from "change-case";
import {ModelSchema} from "../../types";
import {convertSchema} from "../schema";

export const convertSchemaModel = (model: string, schema: OpenapiSchema): ModelSchema => ({
  type: 'model',
  model: pascalCase(model),
  ...convertSchema(schema),
});
