import {isRef} from "./openapi";
import fetch from "node-fetch";
import {AutomatonContext, OpenapiReference} from "../types";
import {dirname, parse, resolve} from 'path';
import {readFile} from 'fs-extra';
import {parseFile} from "./parse";

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
  const file = url ? parseFile<unknown>(await fetchOpenapi(url, openapiPath), url) : openapi;
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

const fetchOpenapi = async (url: string, openapiPath: string): Promise<string> =>
  url.startsWith('http://')
  || url.startsWith('https://')
  || url.startsWith('//')
    ? await fetch(url)
      .then(res => res.text()) : readFile(resolve(dirname(openapiPath), url), {encoding: 'utf-8'})
