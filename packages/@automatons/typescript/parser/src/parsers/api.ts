import {Openapi} from "@automatons/tools";
import {camelCase, pascalCase} from "change-case";
import {convertMap} from "../converters/map";
import {extractPath} from "../extractors/path";
import {Api, Model, Path, Server} from "../types";
import {uniq} from "../utils/uniq";

export const parseApi = (openapi: Openapi): { apis: Api[], models: Model[] } =>
  convertMap(openapi.paths)
    .map(({key, schema}) => extractPath(schema, {path: key, openapi}))
    .flat()
    .reduce<{ apis: Api[], models: Model[] }>((pre, cur) => {
      let apis = pre.apis;
      let models = pre.models;
      cur.tags.forEach(tag => {
        const title = pascalCase(`${tag} Api`);
        const api = apis.find(api => api.title === title);
        models = uniq([...models, ...cur.models], 'title');
        apis = api
          ? [...apis.filter(a => a.title !== title), createApi(title, cur.path, cur.imports, cur.servers, api)]
          : [...apis.filter(a => a.title !== title), createApi(title, cur.path, cur.imports, cur.servers)];
      });
      return {apis, models};
    }, {apis: [], models: []})

const createApi = (title: string, path: Path, imports: Model[], servers: Server[], base?: Api) => ({
  title: pascalCase(title),
  filename: camelCase(title),
  imports: uniq([...base?.imports ?? [], ...imports], 'title'),
  servers: uniq([...base?.servers ?? [], ...servers], 'name'),
  paths: [...base?.paths ?? [], path]
});
