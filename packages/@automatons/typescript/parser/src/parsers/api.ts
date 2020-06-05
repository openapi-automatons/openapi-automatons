import {camelCase, pascalCase} from "change-case";
import {convertMap} from "../converters/map";
import {extractPath} from "../extractors";
import {Api, Model, Path} from "../types";
import {uniq} from "../utils/uniq";
import {AutomatonContext} from "@automatons/tools/dist";
import {overwrite} from "../utils/overwrite";

export const parseApi = async ({openapi, settings}: AutomatonContext): Promise<{ apis: Api[], models: Model[] }> => {
  const paths = (await Promise.all(convertMap(openapi.paths)
    .map(({key, schema}) => extractPath(schema, {path: key, openapi, settings})))).flat();
  return {
    apis: paths
      .reduce<Api[]>((apis, path) =>
        path.tags.reduce<Api[]>((_apis, tag) => {
          const title = pascalCase([tag, 'Api'].join(' '));
          const api = _apis.find(api => api.title === title);
          return overwrite(_apis, createApi(title, path.path, path.imports, api), (item) => item.title !== title);
        }, apis), []),
    models: paths.reduce<Model[]>((models, cur) => uniq([...models, ...cur.models], 'title'), [])
  }
}

const createApi = (title: string, path: Path, imports: Model[], base?: Api) => ({
  title: pascalCase(title),
  filename: camelCase(title),
  imports: uniq([...base?.imports ?? [], ...imports], 'title'),
  servers: uniq([...base?.servers ?? [], ...path.servers], 'name'),
  paths: [...base?.paths ?? [], path]
});
