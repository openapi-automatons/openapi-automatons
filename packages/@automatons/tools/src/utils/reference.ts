import {isRef} from "./openapi";
import {AutomatonContext, OpenapiReference} from "../types";
import {parse} from 'path';
import {fetch} from "./fetch";

export const referenceTitle = (schema: OpenapiReference): string => {
  const [url, path] = schema.$ref.split('#')
  const {name} = parse(url);
  const paths = path.split('/').slice(1);
  if (paths.length) {
    return paths[paths.length - 1];
  } else if (url) {
    return name;
  }
  throw new Error(`Invalid ref format: ${schema.$ref}\n  Can not extract name.`);
}

export const referenceSchema = async <T = unknown>(schema: (T | OpenapiReference) | (T & OpenapiReference), {openapi, settings: {openapiPath}}: AutomatonContext): Promise<T> => {
  if (!isRef(schema)) return schema;
  const [url, path] = schema.$ref.split('#');
  const file = url ? await fetch<T>(url, openapiPath) : openapi;
  if (!path) {
    if (!file) {
      throw new Error(`Invalid ref path ${schema.$ref}`);
    }
    return file as T;
  }
  const paths = path?.split('/').slice(1);
  const extractSchema = paths?.reduce((pre: any, cur) => pre?.[cur], file) as T | undefined;
  if (!extractSchema) {
    throw new Error(`Invalid ref path ${schema.$ref}`);
  }
  return extractSchema;
}
