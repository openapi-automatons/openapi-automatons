import {isRef} from "./openapi";
import fetch from "node-fetch";
import {AutomatonContext, OpenapiReference} from "../types";
import {resolve, parse} from 'path';
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

export const referenceSchema = async <T = unknown>(schema: (T | OpenapiReference), {openapi, settings: {openapiPath}}: AutomatonContext): Promise<T> => {
  if (isRef(schema)) {
    const [url, path] = schema.$ref.split('#');
    const _openapi = url ? parseFile(await fetchOpenapi(url, openapiPath), url)
      : openapi;
    const paths = path.split('/').slice(1);
    const extractSchema = paths.reduce((pre: any, cur) => pre?.[cur], _openapi) as T | undefined;
    if (!extractSchema) {
      throw new Error(`Invalid ref path ${schema.$ref}`);
    }
    return extractSchema;
  }
  return schema;
}

const fetchOpenapi = async (url: string, openapiPath: string): Promise<string> =>
  url.startsWith('http://')
  || url.startsWith('https://')
  || url.startsWith('//')
    ? await fetch(url)
      .then(res => res.text()) : readFile(resolve(openapiPath, url), {encoding: 'utf-8'})
