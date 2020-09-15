import {AutomatonContext, OpenapiSchemaOneOf} from "@automatons/tools/dist";
import {convertSchemaModel} from "../../converters/schemaModel";
import {extractModel} from "../model";
import {convertModel} from "../../converters/model";

export const extractOneOfSchema = async (title: string, schema: OpenapiSchemaOneOf, context: AutomatonContext) => {
  const modelSchema = convertSchemaModel(title, schema);
  const {model, insides} = await extractModel(title, schema, context);
  return {
    schema: modelSchema,
    models: [model, ...insides],
    imports: [convertModel(title, modelSchema)]
  };
}
