import {convertModel} from "../../converters/model";
import {convertOneOf} from "../../converters/oneOf";
import {extractOfModel} from "./of";
import {AutomatonContext, OpenapiSchemaOneOf} from "@automatons/tools/dist";

export const extractOneOfModel = async (title: string, schema: OpenapiSchemaOneOf, context: AutomatonContext) => {
  const {models, schemas, imports} = await extractOfModel(title, schema.oneOf, context);
  return {model: convertModel(title, convertOneOf(schema, schemas), imports), insides: models}
}
