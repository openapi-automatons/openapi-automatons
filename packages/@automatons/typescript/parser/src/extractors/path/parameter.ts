import {extractSchema} from "../schema";
import {pascalCase} from "change-case";
import {
  hasSchema,
  isCookieParam,
  isHeaderParam,
  isPathParam,
  isQueryParam,
  OpenapiParameter,
  referenceSchema
} from "@automatons/tools/dist";
import {ParameterResult, PathContext} from "./type";
import {extractMediaType} from "./mediaType";

/**
 *
 * @param {[]} schema
 * @param {string} path
 * @param {} openapi
 * @return {{parameters: PathParameter[]; models: Model[]; imports?: Model[]}}
 */
export const extractParameter = (schema: OpenapiParameter[], {path, ...context}: PathContext): Promise<ParameterResult> =>
  schema
    .map(param => referenceSchema(param, context))
    .map(async param => {
      const _param = await param;
      const paramSchema = hasSchema(_param) ? _param.schema : _param.content[extractMediaType(_param.content)].schema;
      if (!paramSchema) return;
      const {schema, models, imports} = await extractSchema(pascalCase([path, 'parameter', _param.name].join(' ')),
        paramSchema, context);
      if (isPathParam(_param)) {
        return {
          parameter: {
            name: _param.name,
            schema,
            style: _param.style,
            explode: _param.explode
          },
          models,
          imports
        }
      } else if (isQueryParam(_param)) {
        return {
          query: {
            name: _param.name,
            schema,
            style: _param.style,
            required: _param.required,
            explode: _param.explode
          },
          models,
          imports
        }
      } else if (isHeaderParam(_param)) {
        return {
          header: {
            name: _param.name,
            schema,
            style: _param.style,
            required: _param.required,
            explode: _param.explode
          },
          models,
          imports
        }
      } else if (isCookieParam(_param)) {
        return {
          cookie: {
            name: _param.name,
            schema,
            style: _param.style,
            required: _param.required,
            explode: _param.explode
          },
          models,
          imports
        }
      }
      return;
    })
    .reduce<Promise<ParameterResult>>(async (pre, cur) => {
      const previous = await pre;
      const current = await cur;
      return current ? ({
          parameters: current.parameter ? [...previous.parameters, current.parameter] : previous.parameters,
          queries: current.query ? [...previous.queries, current.query] : previous.queries,
          headers: current.header ? [...previous.headers, current.header] : previous.headers,
          cookies: current.cookie ? [...previous.cookies, current.cookie] : previous.cookies,
          models: [...previous.models, ...current.models],
          imports: [...previous.imports, ...current.imports ?? []]
        })
        : previous;
    }, Promise.resolve({parameters: [], queries: [], headers: [], cookies: [], models: [], imports: []}))
