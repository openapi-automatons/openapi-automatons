import {OpenapiSchemaInteger, OpenapiSchemaNumber} from "@automatons/tools/dist";
import {convertSchemaModel} from "../../converters/schemaModel";
import {convertModel} from "../../converters/model";
import {convertNumber} from "../../converters/number";

export const extractNumberSchema = (title: string, schema: OpenapiSchemaNumber | OpenapiSchemaInteger) => {
  if (schema.title) {
    const modelSchema = convertSchemaModel(title, schema);
    const models = [convertModel(title, convertNumber(schema))];
    return {schema: modelSchema, models, imports: models};
  }
  return {schema: convertNumber(schema), models: []};
}
