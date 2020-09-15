import {OpenapiSchemaBoolean} from "@automatons/tools/dist";
import {convertSchemaModel} from "../../converters/schemaModel";
import {convertModel} from "../../converters/model";
import {convertBoolean} from "../../converters/boolean";

export const extractBooleanSchema = (title: string, schema: OpenapiSchemaBoolean) => {
  if (schema.title) {
    const modelSchema = convertSchemaModel(title, schema);
    const models = [convertModel(title, convertBoolean(schema))];
    return {schema: modelSchema, models, imports: models};
  }
  return {schema: convertBoolean(schema), models: []};
}
