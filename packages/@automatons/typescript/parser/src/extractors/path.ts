import {
  HTTP_METHODS,
  Method,
  Openapi,
  OpenapiMap,
  OpenapiParameter,
  OpenapiPath,
  OpenapiPathMedia,
  OpenapiPathOperation,
  OpenapiPathResponse,
  OpenapiReference
} from "@automatons/tools";
import {camelCase, pascalCase} from "change-case";
import {CookieParameter, HeaderParameter, Model, Path, PathParameter, QueryParameter, Server} from "../types";
import {isRef} from "../utils/openapi";
import {hasSchema, isCookieParam, isHeaderParam, isPathParam, isQueryParam} from "../utils/parameter";
import {extractSchema} from "./schema";
import {convertServer} from "../converters/server";

type PathContext = { path: string, openapi: Openapi };
type PathReturn = { tags: string[], path: Path, models: Model[], imports: Model[], servers: Server[] };
export const extractPath = (schema: OpenapiPath, {path, openapi}: PathContext): PathReturn[] => {
  const params = schema.parameters ? extractParameters(schema.parameters, {path, openapi}) : undefined;

  return HTTP_METHODS
    .map<{ method: Method, operation: OpenapiPath | undefined }>(method => ({method, operation: schema[method]}))
    .filter<{ method: Method, operation: OpenapiPathOperation }>(
      (operation): operation is { method: Method, operation: OpenapiPathOperation } => !!operation.operation)
    .map(({method, operation}) => {
      const servers = (operation.servers || schema.servers || openapi.servers || [])
        .map(convertServer);
      const methodParams = operation.parameters ? extractParameters(operation.parameters, {path, openapi}) : undefined;
      const response = operation.responses[extractStatus(operation.responses)];
      if (!isRef(response)) { // TODO ref
        const content = response.content;
        if (content) {
          const responseOSchema = content[extractMediaType(content)].schema;
          if (responseOSchema) {
            const {schema: responseSchema, models, imports} = extractSchema([...path.split('/'), method, 'Response'].join(' '),
              responseOSchema, openapi);
            return {
              tags: operation.tags ?? ['default'],
              path: {
                path,
                name: camelCase(operation.operationId ?? [method, ...path.split('/')].join(' ')),
                method,
                servers,
                parameters: [...params?.parameters ?? [], ...methodParams?.parameters ?? []],
                queries: [...params?.queries ?? [], ...methodParams?.queries ?? []].sort(parameterCompare),
                headers: [...params?.headers ?? [], ...methodParams?.headers ?? []].sort(parameterCompare),
                cookies: [...params?.cookies ?? [], ...methodParams?.cookies ?? []].sort(parameterCompare),
                schema: responseSchema
              },
              models: [...models, ...params?.models ?? [], ...methodParams?.models ?? []],
              imports: [...imports ?? [], ...params?.imports ?? [], ...methodParams?.imports ?? []],
              servers
            }
          }
        }
        return {
          tags: operation.tags ?? ['default'],
          path: {
            path,
            name: camelCase(operation.operationId ?? [method, ...path.split('/')].join(' ')),
            method,
            servers,
            parameters: [...params?.parameters ?? [], ...methodParams?.parameters ?? []],
            queries: [...params?.queries ?? [], ...methodParams?.queries ?? []].sort(parameterCompare),
            headers: [...params?.headers ?? [], ...methodParams?.headers ?? []].sort(parameterCompare),
            cookies: [...params?.cookies ?? [], ...methodParams?.cookies ?? []].sort(parameterCompare),
          },
          models: [],
          imports: [],
          servers
        }
      }
      throw new Error(`Unsupported path\n${JSON.stringify(schema, undefined, 2)}`);
    })
}

type ParameterResult = {
  parameters: PathParameter[],
  queries: QueryParameter[],
  headers: HeaderParameter[],
  cookies: CookieParameter[],
  models: Model[],
  imports: Model[]
};

/**
 *
 * @todo query
 * @todo header
 * @todo cookie
 * @param {[]} schema
 * @param {string} path
 * @param {} openapi
 * @return {{parameters: PathParameter[]; models: Model[]; imports?: Model[]}}
 */
export const extractParameters = (schema: OpenapiParameter[], {path, openapi}: PathContext):
  ParameterResult =>
  schema
    .map(param => {
      const paramSchema = hasSchema(param) ? param.schema : param.content[extractMediaType(param.content)].schema;
      if (!paramSchema) return;
      const {schema, models, imports} = extractSchema(pascalCase([path, 'parameter', param.name].join(' ')),
        paramSchema, openapi);
      if (isPathParam(param)) {
        return {
          parameter: {
            name: param.name,
            schema,
            style: param.style,
            explode: param.explode
          },
          models,
          imports
        }
      } else if (isQueryParam(param)) {
        return {
          query: {
            name: param.name,
            schema,
            style: param.style,
            required: param.required,
            explode: param.explode
          },
          models,
          imports
        }
      } else if (isHeaderParam(param)) {
        return {
          header: {
            name: param.name,
            schema,
            style: param.style,
            required: param.required,
            explode: param.explode
          },
          models,
          imports
        }
      } else if (isCookieParam(param)) {
        return {
          cookie: {
            name: param.name,
            schema,
            style: param.style,
            required: param.required,
            explode: param.explode
          },
          models,
          imports
        }
      }
      return;
    })
    .reduce<ParameterResult>((pre, cur) => cur ? ({
        parameters: cur.parameter ? [...pre.parameters, cur.parameter] : pre.parameters,
        queries: cur.query ? [...pre.queries, cur.query] : pre.queries,
        headers: cur.header ? [...pre.headers, cur.header] : pre.headers,
        cookies: cur.cookie ? [...pre.cookies, cur.cookie] : pre.cookies,
        models: [...pre.models, ...cur.models],
        imports: [...pre.imports, ...cur.imports ?? []]
      })
      : pre, {parameters: [], queries: [], headers: [], cookies: [], models: [], imports: []})

export const extractMediaType = (schema: OpenapiMap<OpenapiPathMedia>): keyof OpenapiMap<OpenapiPathMedia> => {
  return schema.hasOwnProperty('application/json') ?
    'application/json' :
    schema.hasOwnProperty('application/*') ?
      'application/*' :
      schema.hasOwnProperty('default') ?
        'default' : Object.keys(schema)[0];
};

export const extractStatus = (schema: OpenapiMap<OpenapiPathResponse | OpenapiReference>): keyof OpenapiMap<OpenapiPathResponse | OpenapiReference> => {
  const statuses = Object.keys(schema);
  return statuses
    .map(status => Number(status))
    .filter(status => Number(status) >= 200 && Number(status) < 300)
    .sort()[0] ?? statuses[0];
}

const parameterCompare = (a: QueryParameter | HeaderParameter | CookieParameter,
                          b: QueryParameter | HeaderParameter | CookieParameter) =>
  a.required === true && b.required === true ? 0 : b.required === true ? 1 : -1;
