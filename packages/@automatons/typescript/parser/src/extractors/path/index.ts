import {AutomatonContext, HTTP_METHODS, Method, OpenapiPath, OpenapiPathOperation} from "@automatons/tools";
import {PathReturn} from "./type";
import {extractMethod} from "./method";

type PathContext = { path: string } & AutomatonContext;

export const extractPath = (schema: OpenapiPath, {path, openapi, settings}: PathContext): Promise<PathReturn[]> =>
  Promise.all(HTTP_METHODS
    .map<{ method: Method, operation: OpenapiPath | undefined }>(method => ({method, operation: schema[method]}))
    .filter<{ method: Method, operation: OpenapiPathOperation }>(
      (operation): operation is { method: Method, operation: OpenapiPathOperation } => !!operation.operation)
    .map(({method, operation}) => extractMethod(path, method, operation, schema, {openapi, settings})))
