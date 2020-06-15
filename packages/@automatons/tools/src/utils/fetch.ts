import nodeFetch from "node-fetch";
import {readFile} from "fs-extra";
import {dirname, extname, resolve} from "path";
import {Openapi} from "../types";
import {safeLoad} from "js-yaml";
import {parse as parseUrl} from "url";

export const fetch = async <T = Openapi>(url: string, openapiPath?: string): Promise<T> =>
  parse(await (isUrl(url)
    ? await nodeFetch(url).then(res => res.text())
    : openapiPath
      ? isUrl(openapiPath)
        ? await nodeFetch(urlJoin(openapiPath, url)).then(res => res.text())
        : readFile(resolve(dirname(openapiPath), url), {encoding: 'utf-8'})
      : readFile(resolve(url), {encoding: 'utf-8'})), url)

const urlJoin = (base: string, path: string) => {
  const url = parseUrl(base);
  return `${url.protocol}//${url.host}${resolve(dirname(url.pathname ?? ''), path)}`
}

const isUrl = (url: string) =>
  url.startsWith('http://')
  || url.startsWith('https://');

const parse = <T = Openapi>(data: string, filePath: string): T => {
  switch (extname(filePath)) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
    case '.yaml':
      return safeLoad(data);
    default:
      throw new Error('Unsupported file extension');
  }
};
