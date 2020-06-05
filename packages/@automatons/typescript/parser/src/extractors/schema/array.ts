import {AutomatonContext, OpenapiSchemaArray} from "@automatons/tools/dist";
import {Model} from "../../types";
import {pascalCase} from "change-case";
import {convertSchemaModel} from "../../converters/schemaModel";
import {convertModel} from "../../converters/model";
import {convertArray} from "../../converters/array";
import {extractSchema} from "./index";

export const extractArraySchema = async (title: string, schema: OpenapiSchemaArray, context: AutomatonContext) => {
  const models: Model[] = [];
  const imports: Model[] = [];
  let itemSchema = undefined;
  if (schema.items) {
    const {schema: shm, models: itemModels, imports: itemImports} =
      await extractSchema(pascalCase([title, 'Item'].join(' ')), schema.items, context);
    itemSchema = shm;
    models.push(...itemModels);
    imports.push(...(itemImports ?? []));
  }
  if (schema.title) {
    const modelSchema = convertSchemaModel(schema.title ?? title, schema);
    const model = convertModel(schema.title ?? title, convertArray(schema, itemSchema));
    return {schema: modelSchema, models: [model, ...models], imports: [...models]};
  }
  return {
    schema: convertArray(schema, itemSchema),
    models: models,
    imports
  };
}
