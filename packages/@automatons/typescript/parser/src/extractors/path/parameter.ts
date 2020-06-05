import {extractSchema} from "../schema";
import {pascalCase} from "change-case";
import {
  hasSchema,
  isCookieParam,
  isHeaderParam,
  isPathParam,
  isQueryParam,
  OpenapiParameter
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
    .map(async param => {
      const paramSchema = hasSchema(param) ? param.schema : param.content[extractMediaType(param.content)].schema;
      if (!paramSchema) return;
      const {schema, models, imports} = await extractSchema(pascalCase([path, 'parameter', param.name].join(' ')),
        paramSchema, context);
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
