import {AutomatonContext, OpenapiSchemaObject} from "@automatons/tools/dist";
import {convertSchemaModel} from "../../converters/schemaModel";
import {extractModel} from "../model";
import {convertModel} from "../../converters/model";

export const extractObjectSchema = async (title: string, schema: OpenapiSchemaObject, context: AutomatonContext) => {
  const modelSchema = convertSchemaModel(title, schema);
  const {model, insides} = await extractModel(title, schema, context);
  return {
    schema: modelSchema,
    models: [model, ...insides],
    imports: [convertModel(title, modelSchema)]
  };
}
