import {convertSchemaModel} from "../../converters/schemaModel";
import {convertModel} from "../../converters/model";
import {
  AutomatonContext,
  OpenapiSchema,
  OpenapiSchemaReference,
  referenceSchema,
  referenceTitle
} from "@automatons/tools/dist";
import {ExtractModel} from "./type";

export const extractRefModel = async (title: string, schema: OpenapiSchemaReference, context: AutomatonContext): Promise<ExtractModel> => {
  const refSchema = await referenceSchema<OpenapiSchema>(schema, context);
  const refTitle = referenceTitle(schema);

  const ref = convertSchemaModel(refTitle, refSchema);
  return {model: convertModel(title, ref, [convertModel(refTitle, ref)]), insides: []};
}
