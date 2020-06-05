import {OpenapiSchemaString} from "@automatons/tools/dist";
import {convertSchemaModel} from "../../converters/schemaModel";
import {convertModel} from "../../converters/model";
import {convertString} from "../../converters/string";

export const extractStringSchema = (title: string, schema: OpenapiSchemaString) => {
  if (schema.title) {
    const modelSchema = convertSchemaModel(schema.title ?? title, schema);
    const models = [convertModel(schema.title ?? title, convertString(schema))];
    return {schema: modelSchema, models, imports: models};
  }
  return {schema: convertString(schema), models: []};
}
