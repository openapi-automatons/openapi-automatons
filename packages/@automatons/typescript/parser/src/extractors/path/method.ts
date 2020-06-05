import {AutomatonContext, Method, OpenapiParameter, OpenapiPath, OpenapiPathOperation} from "@automatons/tools/dist";
import {convertServer} from "../../converters/server";
import {extractParameter} from "./parameter";
import {extractResponse} from "./response";
import {extractSecurity} from "./security";
import {
  CookieParameter,
  Form,
  HeaderParameter,
  Model,
  PathParameter,
  QueryParameter,
  Schema,
  Security,
  Server
} from "../../types";
import {extractRequestBody} from "./requestBody";
import {camelCase} from "change-case";
import {requiredCompare} from "../../utils/sort";
import {PathReturn} from "./type";

const mergeModels = (main: Models, adding: Models) => {
  main.models.push(...adding.models);
  main.imports.push(...adding.imports)
}

async function mergeParameter(parameters: OpenapiParameter[], path: string, params: Params, models: Models, {openapi, settings}: AutomatonContext) {
  const {parameters: _parameters, queries: _queries, headers: _headers, cookies: _cookies, models: _models, imports: _imports} =
    await extractParameter(parameters, {path, openapi, settings});
  params.parameters.push(..._parameters);
  params.queries.push(..._queries);
  params.headers.push(..._headers);
  params.cookies.push(..._cookies);
  mergeModels(models, {models: _models, imports: _imports});
}

type Models = {
  models: Model[];
  imports: Model[];
}

type Params = {
  parameters: PathParameter[];
  queries: QueryParameter[];
  headers: HeaderParameter[];
  cookies: CookieParameter[];
};

type Data = {
  params: Params;
  servers: Server[];
  securities?: Security[];
  forms?: Form[];
  schema?: Schema;
};

export const extractMethod = async (path: string, method: Method, operation: OpenapiPathOperation, schema: OpenapiPath, {openapi, settings}: AutomatonContext): Promise<PathReturn> => {
  const models: Models = {
    models: [],
    imports: []
  };
  const params: Params = {
    parameters: [],
    queries: [],
    headers: [],
    cookies: []
  };
  const data: Data = {
    params,
    servers: (operation.servers || schema.servers || openapi.servers || [])
      .map(convertServer),
    securities: extractSecurity(operation, openapi)
  }

  if (schema.parameters) {
    await mergeParameter(schema.parameters, path, params, models, {openapi, settings});
  }

  if (operation.parameters) {
    await mergeParameter(operation.parameters, path, params, models, {openapi, settings});
  }

  if (operation.requestBody) {
    const bodies: { forms: Form[], models: Model[], imports: Model[]; } =
      await extractRequestBody(operation.requestBody, path, method, {openapi, settings});
    data.forms = bodies.forms;
    mergeModels(models, {models: bodies.models, imports: bodies.imports});
  }

  const response = await extractResponse(operation.responses, method, {path, openapi, settings});

  if (response) {
    data.schema = response.schema;
    mergeModels(models, {models: response.models, imports: response.imports ?? []});
  }

  return convertPath(path, method, operation, data, models)
};

const convertPath = (path: string, method: Method, operation: OpenapiPathOperation, {params, servers, securities, forms, schema}: Data, models: Models): PathReturn => ({
  tags: operation.tags && operation.tags.length ? operation.tags : ['default'],
  path: {
    name: camelCase(operation.operationId ?? [method, ...path.split('/')].join(' ')),
    path,
    method,
    servers,
    parameters: params.parameters,
    queries: params.queries.sort(requiredCompare),
    headers: params.headers.sort(requiredCompare),
    cookies: params.cookies.sort(requiredCompare),
    ...(securities ? {securities} : {}),
    ...(forms ? {forms} : {}),
    ...(schema ? {schema} : {})
  },
  ...models
});

