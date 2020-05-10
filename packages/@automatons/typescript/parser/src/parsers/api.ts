import {Openapi} from "@automatons/tools";
import {
  HTTP_METHODS,
  Method,
  OpenapiPathOperation,
} from "@automatons/tools/dist";
import {camelCase, pascalCase} from "change-case";
import {convertMap} from "../converters/map";
import {Model, Api} from "../types";
import {isRef} from "../utils/openapi";

export class ApiParser {
  private openapi: Openapi;
  private map: any;

  constructor(openapi: Openapi, map: object) {
    this.openapi = openapi;
    this.map = map;
  }

  parse(): Api[] {
    const apis: { [key: string]: Api } = {};

    convertMap(this.openapi.paths)
      .forEach(({key: pathKey, schema: pathSchema}) => {
        HTTP_METHODS
          .forEach(method => {
            const methodSchema = pathSchema[method];
            if (!methodSchema) return;
            const {tags, model} = this.extractModel(methodSchema, this.map[pathKey]?.[method]);
            tags.forEach(tag => {
              const name = pascalCase(tag);
              if (!apis[name]) {
                const title = `${tag}Api`;
                apis[name] = {
                  title: pascalCase(title),
                  filename: camelCase(title),
                  imports: [],
                  paths: []
                }
              }
              if (model && !apis[name].imports.find(item => item.title === model.title)) {
                apis[name].imports.push(model);
              }
              apis[name].paths.push(this.createPath(pathKey, method, methodSchema, model))
            })
          })
      })
    return Object.values(apis);
  }

  private createPath(path: string, method: Method, operation: OpenapiPathOperation, model?: Model) {
    return {
      path,
      name: camelCase(operation.operationId ?? ['get', ...path.split('/')].join(' ')),
      method,
      model
    };
  }

  private extractModel(schema: OpenapiPathOperation, map: any = {}): { tags: string[], model?: Model } {
    const tags = !schema.tags || !schema.tags.length ? ['default'] : schema.tags;
    const responses = schema.responses;
    const statuses = Object.keys(responses);
    if (!statuses.length) throw new Error('No status response');
    const status = statuses
      .map(status => Number(status))
      .filter(status => Number(status) >= 200 && Number(status) < 300)
      .sort()[0] ?? (responses.hasOwnProperty('default')
      ? 'default'
      : statuses[0]);
    const response = responses[status];
    if (!isRef(response)) {
      const content = response.content;
      const types = Object.keys(content ?? {});
      if (!content || !types.length) return {tags};
      const type = content.hasOwnProperty('application/json') ?
        'application/json' :
        content.hasOwnProperty('application/*') ?
          'application/*' :
          content.hasOwnProperty('default') ?
            'default' : types[0];
      return {
        tags,
        model: map[status]?.[type]
      }
    }
    return {
      tags
    }
  }


  // private static createApi(tag: string) {
  //   return {title: pascalCase([tag, 'Api'].join(' ')), filename: camelCase(tag)};
  // }
}
