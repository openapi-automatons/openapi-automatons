import {OpenapiSchemaReference, referenceTitle} from "@automatons/tools/dist";
import {convertSchemaModel} from "../../converters/schemaModel";
import {convertModel} from "../../converters/model";

export const extractRefSchema = (title: string, schema: OpenapiSchemaReference) => {
  const name = schema.title ?? referenceTitle(schema) ?? title;
  const modelSchema = convertSchemaModel(name, schema);
  return {
    schema: modelSchema,
    models: [],
    imports: [convertModel(name, modelSchema)]
  };
}
