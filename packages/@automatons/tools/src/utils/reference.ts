import {isRef} from "./openapi";
import fetch from "node-fetch";
import {AutomatonContext, OpenapiReference} from "../types";
import {resolve} from 'path';
import {readFile} from 'fs-extra';
import {parseFile} from "./parse";

export const reference = async <T = unknown>(schema: (T | OpenapiReference), {openapi, settings: {openapiPath}}: AutomatonContext): Promise<T> => {
  if (isRef(schema)) {
    const [url, path] = schema.$ref.split('#');
    const _openapi = url ? parseFile(await fetchOpenapi(url, openapiPath), url)
      : openapi;
    const paths = path.split('/').slice(1);
    return paths.reduce((pre: any, cur) => pre?.[cur], _openapi) as T
  }
  return schema;
}

const fetchOpenapi = async (url: string, openapiPath: string): Promise<string> =>
  url.startsWith('http') ? await fetch(url)
    .then(res => res.text()) : readFile(resolve(openapiPath, url), {encoding: 'utf-8'})
