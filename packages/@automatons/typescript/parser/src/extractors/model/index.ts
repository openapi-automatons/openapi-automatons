import {convertModel} from "../../converters/model";
import {convertString} from "../../converters/string";
import {convertNumber} from "../../converters/number";
import {extractAllOfModel} from "./allOf";
import {extractArrayModel} from "./array";
import {extractObjectModel} from "./object";
import {extractOneOfModel} from "./oneOf";
import {extractRefModel} from "./ref";
import {
  AutomatonContext,
  isSchemaAllOf,
  isSchemaArray,
  isSchemaInteger,
  isSchemaNumber,
  isSchemaObject,
  isSchemaOneOf,
  isSchemaRef,
  isSchemaString,
  OpenapiSchema
} from "@automatons/tools/dist";
import {ExtractModel} from "./type";

export const extractModel = async (title: string, schema: OpenapiSchema, context: AutomatonContext): Promise<ExtractModel> => {
  if (isSchemaString(schema)) {
    return {model: convertModel(title, convertString(schema)), insides: []};
  } else if (isSchemaNumber(schema) || isSchemaInteger(schema)) {
    return {model: convertModel(title, convertNumber(schema)), insides: []};
  } else if (isSchemaArray(schema)) {
    return extractArrayModel(title, schema, context);
  } else if (isSchemaObject(schema)) {
    return extractObjectModel(title, schema, context);
  } else if (isSchemaAllOf(schema)) {
    return extractAllOfModel(title, schema, context);
  } else if (isSchemaOneOf(schema)) {
    return extractOneOfModel(title, schema, context);
  } else if (isSchemaRef(schema)) {
    return extractRefModel(title, schema, context);
  }
  throw new Error(`Unknown type\n${JSON.stringify(schema, undefined, 2)}`);
}
