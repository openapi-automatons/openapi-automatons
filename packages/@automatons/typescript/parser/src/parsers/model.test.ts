import {Openapi, OpenapiSchema} from "@automatons/tools";
import {parseModel} from "./model";

describe('model parser', () => {
  it('should be throw not found', () => {
    const openapi = createOpenapi(createSchema('$ref', undefined, 'Test'))
    expect(() => {
      parseModel(openapi);
    }).toThrow('Not found Reference');
  });

  it.each<[string, string | undefined, string | undefined, string[]]>([
    ['string', undefined, undefined, ['string']],
    ['number', undefined, undefined, ['number']],
    ['integer', undefined, undefined, ['number']],

    ['array', undefined, undefined, ['array']],
    ['array', 'string', undefined, ['array']],
    ['array', 'number', undefined, ['array']],
    ['array', 'integer', undefined, ['array']],
    ['array', 'array', undefined, ['array']],
    ['array', 'array', 'string', ['array']],
    ['array', 'array', 'number', ['array']],
    ['array', 'array', 'integer', ['array']],
    ['array', 'array', 'array', ['array']],
    ['array', 'array', 'object', ['array', 'object']],
    ['array', 'array', 'allOf', ['array', 'allOf']],
    ['array', 'array', 'oneOf', ['array', 'oneOf']],
    ['array', 'array', '$ref', ['array']],
    ['array', 'object', undefined, ['array', 'object']],
    ['array', 'object', 'string', ['array', 'object']],
    ['array', 'object', 'number', ['array', 'object']],
    ['array', 'object', 'integer', ['array', 'object']],
    ['array', 'object', 'array', ['array', 'object']],
    ['array', 'object', 'object', ['array', 'object', 'object']],
    ['array', 'object', 'allOf', ['array', 'object', 'allOf']],
    ['array', 'object', 'oneOf', ['array', 'object', 'oneOf']],
    ['array', 'object', '$ref', ['array', 'object']],
    ['array', 'allOf', undefined, ['array', 'allOf']],
    ['array', 'allOf', 'string', ['array', 'allOf']],
    ['array', 'allOf', 'number', ['array', 'allOf']],
    ['array', 'allOf', 'integer', ['array', 'allOf']],
    ['array', 'allOf', 'array', ['array', 'allOf']],
    ['array', 'allOf', 'object', ['array', 'allOf', 'object']],
    ['array', 'allOf', 'allOf', ['array', 'allOf', 'allOf']],
    ['array', 'allOf', 'oneOf', ['array', 'allOf', 'oneOf']],
    ['array', 'allOf', '$ref', ['array', 'allOf']],
    ['array', 'oneOf', undefined, ['array', 'oneOf']],
    ['array', 'oneOf', 'string', ['array', 'oneOf']],
    ['array', 'oneOf', 'number', ['array', 'oneOf']],
    ['array', 'oneOf', 'integer', ['array', 'oneOf']],
    ['array', 'oneOf', 'array', ['array', 'oneOf']],
    ['array', 'oneOf', 'object', ['array', 'oneOf', 'object']],
    ['array', 'oneOf', 'allOf', ['array', 'oneOf', 'allOf']],
    ['array', 'oneOf', 'oneOf', ['array', 'oneOf', 'oneOf']],
    ['array', 'oneOf', '$ref', ['array', 'oneOf']],
    ['array', '$ref', 'string', ['array']],
    ['array', '$ref', 'number', ['array']],
    ['array', '$ref', 'integer', ['array']],
    ['array', '$ref', 'array', ['array']],
    ['array', '$ref', 'object', ['array']],
    ['array', '$ref', 'allOf', ['array']],
    ['array', '$ref', 'oneOf', ['array']],
    ['array', '$ref', '$ref', ['array']],

    ['object', undefined, undefined, ['object']],
    ['object', 'string', undefined, ['object']],
    ['object', 'number', undefined, ['object']],
    ['object', 'integer', undefined, ['object']],
    ['object', 'array', undefined, ['object']],
    ['object', 'array', 'string', ['object']],
    ['object', 'array', 'number', ['object']],
    ['object', 'array', 'integer', ['object']],
    ['object', 'array', 'array', ['object']],
    ['object', 'array', 'object', ['object', 'object']],
    ['object', 'array', 'allOf', ['object', 'allOf']],
    ['object', 'array', 'oneOf', ['object', 'oneOf']],
    ['object', 'array', '$ref', ['object']],
    ['object', 'object', undefined, ['object', 'object']],
    ['object', 'object', 'string', ['object', 'object']],
    ['object', 'object', 'number', ['object', 'object']],
    ['object', 'object', 'integer', ['object', 'object']],
    ['object', 'object', 'array', ['object', 'object']],
    ['object', 'object', 'object', ['object', 'object', 'object']],
    ['object', 'object', 'allOf', ['object', 'object', 'allOf']],
    ['object', 'object', 'oneOf', ['object', 'object', 'oneOf']],
    ['object', 'object', '$ref', ['object', 'object']],
    ['object', 'allOf', undefined, ['object', 'allOf']],
    ['object', 'allOf', 'string', ['object', 'allOf']],
    ['object', 'allOf', 'number', ['object', 'allOf']],
    ['object', 'allOf', 'integer', ['object', 'allOf']],
    ['object', 'allOf', 'array', ['object', 'allOf']],
    ['object', 'allOf', 'object', ['object', 'allOf', 'object']],
    ['object', 'allOf', 'allOf', ['object', 'allOf', 'allOf']],
    ['object', 'allOf', 'oneOf', ['object', 'allOf', 'oneOf']],
    ['object', 'allOf', '$ref', ['object', 'allOf']],
    ['object', 'oneOf', undefined, ['object', 'oneOf']],
    ['object', 'oneOf', 'string', ['object', 'oneOf']],
    ['object', 'oneOf', 'number', ['object', 'oneOf']],
    ['object', 'oneOf', 'integer', ['object', 'oneOf']],
    ['object', 'oneOf', 'array', ['object', 'oneOf']],
    ['object', 'oneOf', 'object', ['object', 'oneOf', 'object']],
    ['object', 'oneOf', 'allOf', ['object', 'oneOf', 'allOf']],
    ['object', 'oneOf', 'oneOf', ['object', 'oneOf', 'oneOf']],
    ['object', 'oneOf', '$ref', ['object', 'oneOf']],
    ['object', '$ref', 'string', ['object']],
    ['object', '$ref', 'number', ['object']],
    ['object', '$ref', 'integer', ['object']],
    ['object', '$ref', 'array', ['object']],
    ['object', '$ref', 'object', ['object']],
    ['object', '$ref', 'allOf', ['object']],
    ['object', '$ref', 'oneOf', ['object']],
    ['object', '$ref', '$ref', ['object']],

    ['allOf', undefined, undefined, ['allOf']],
    ['allOf', 'string', undefined, ['allOf']],
    ['allOf', 'number', undefined, ['allOf']],
    ['allOf', 'integer', undefined, ['allOf']],
    ['allOf', 'array', undefined, ['allOf']],
    ['allOf', 'array', 'string', ['allOf']],
    ['allOf', 'array', 'number', ['allOf']],
    ['allOf', 'array', 'integer', ['allOf']],
    ['allOf', 'array', 'array', ['allOf']],
    ['allOf', 'array', 'object', ['allOf', 'object']],
    ['allOf', 'array', 'allOf', ['allOf', 'allOf']],
    ['allOf', 'array', 'oneOf', ['allOf', 'oneOf']],
    ['allOf', 'array', '$ref', ['allOf']],
    ['allOf', 'object', undefined, ['allOf', 'object']],
    ['allOf', 'object', 'string', ['allOf', 'object']],
    ['allOf', 'object', 'number', ['allOf', 'object']],
    ['allOf', 'object', 'integer', ['allOf', 'object']],
    ['allOf', 'object', 'array', ['allOf', 'object']],
    ['allOf', 'object', 'object', ['allOf', 'object', 'object']],
    ['allOf', 'object', 'allOf', ['allOf', 'object', 'allOf']],
    ['allOf', 'object', 'oneOf', ['allOf', 'object', 'oneOf']],
    ['allOf', 'object', '$ref', ['allOf', 'object']],
    ['allOf', 'allOf', undefined, ['allOf', 'allOf']],
    ['allOf', 'allOf', 'string', ['allOf', 'allOf']],
    ['allOf', 'allOf', 'number', ['allOf', 'allOf']],
    ['allOf', 'allOf', 'integer', ['allOf', 'allOf']],
    ['allOf', 'allOf', 'array', ['allOf', 'allOf']],
    ['allOf', 'allOf', 'object', ['allOf', 'allOf', 'object']],
    ['allOf', 'allOf', 'allOf', ['allOf', 'allOf', 'allOf']],
    ['allOf', 'allOf', 'oneOf', ['allOf', 'allOf', 'oneOf']],
    ['allOf', 'allOf', '$ref', ['allOf', 'allOf']],
    ['allOf', 'oneOf', undefined, ['allOf', 'oneOf']],
    ['allOf', 'oneOf', 'string', ['allOf', 'oneOf']],
    ['allOf', 'oneOf', 'number', ['allOf', 'oneOf']],
    ['allOf', 'oneOf', 'integer', ['allOf', 'oneOf']],
    ['allOf', 'oneOf', 'array', ['allOf', 'oneOf']],
    ['allOf', 'oneOf', 'object', ['allOf', 'oneOf', 'object']],
    ['allOf', 'oneOf', 'allOf', ['allOf', 'oneOf', 'allOf']],
    ['allOf', 'oneOf', 'oneOf', ['allOf', 'oneOf', 'oneOf']],
    ['allOf', 'oneOf', '$ref', ['allOf', 'oneOf']],
    ['allOf', '$ref', 'string', ['allOf']],
    ['allOf', '$ref', 'number', ['allOf']],
    ['allOf', '$ref', 'integer', ['allOf']],
    ['allOf', '$ref', 'array', ['allOf']],
    ['allOf', '$ref', 'object', ['allOf']],
    ['allOf', '$ref', 'allOf', ['allOf']],
    ['allOf', '$ref', 'oneOf', ['allOf']],
    ['allOf', '$ref', '$ref', ['allOf']],

    ['oneOf', undefined, undefined, ['oneOf']],
    ['oneOf', 'string', undefined, ['oneOf']],
    ['oneOf', 'number', undefined, ['oneOf']],
    ['oneOf', 'integer', undefined, ['oneOf']],
    ['oneOf', 'array', undefined, ['oneOf']],
    ['oneOf', 'array', 'string', ['oneOf']],
    ['oneOf', 'array', 'number', ['oneOf']],
    ['oneOf', 'array', 'integer', ['oneOf']],
    ['oneOf', 'array', 'array', ['oneOf']],
    ['oneOf', 'array', 'object', ['oneOf', 'object']],
    ['oneOf', 'array', 'allOf', ['oneOf', 'allOf']],
    ['oneOf', 'array', 'oneOf', ['oneOf', 'oneOf']],
    ['oneOf', 'array', '$ref', ['oneOf']],
    ['oneOf', 'object', undefined, ['oneOf', 'object']],
    ['oneOf', 'object', 'string', ['oneOf', 'object']],
    ['oneOf', 'object', 'number', ['oneOf', 'object']],
    ['oneOf', 'object', 'integer', ['oneOf', 'object']],
    ['oneOf', 'object', 'array', ['oneOf', 'object']],
    ['oneOf', 'object', 'object', ['oneOf', 'object', 'object']],
    ['oneOf', 'object', 'allOf', ['oneOf', 'object', 'allOf']],
    ['oneOf', 'object', 'oneOf', ['oneOf', 'object', 'oneOf']],
    ['oneOf', 'object', '$ref', ['oneOf', 'object']],
    ['oneOf', 'allOf', undefined, ['oneOf', 'allOf']],
    ['oneOf', 'allOf', 'string', ['oneOf', 'allOf']],
    ['oneOf', 'allOf', 'number', ['oneOf', 'allOf']],
    ['oneOf', 'allOf', 'integer', ['oneOf', 'allOf']],
    ['oneOf', 'allOf', 'array', ['oneOf', 'allOf']],
    ['oneOf', 'allOf', 'object', ['oneOf', 'allOf', 'object']],
    ['oneOf', 'allOf', 'allOf', ['oneOf', 'allOf', 'allOf']],
    ['oneOf', 'allOf', 'oneOf', ['oneOf', 'allOf', 'oneOf']],
    ['oneOf', 'allOf', '$ref', ['oneOf', 'allOf']],
    ['oneOf', 'oneOf', undefined, ['oneOf', 'oneOf']],
    ['oneOf', 'oneOf', 'string', ['oneOf', 'oneOf']],
    ['oneOf', 'oneOf', 'number', ['oneOf', 'oneOf']],
    ['oneOf', 'oneOf', 'integer', ['oneOf', 'oneOf']],
    ['oneOf', 'oneOf', 'array', ['oneOf', 'oneOf']],
    ['oneOf', 'oneOf', 'object', ['oneOf', 'oneOf', 'object']],
    ['oneOf', 'oneOf', 'allOf', ['oneOf', 'oneOf', 'allOf']],
    ['oneOf', 'oneOf', 'oneOf', ['oneOf', 'oneOf', 'oneOf']],
    ['oneOf', 'oneOf', '$ref', ['oneOf', 'oneOf']],
    ['oneOf', '$ref', 'string', ['oneOf']],
    ['oneOf', '$ref', 'number', ['oneOf']],
    ['oneOf', '$ref', 'integer', ['oneOf']],
    ['oneOf', '$ref', 'array', ['oneOf']],
    ['oneOf', '$ref', 'object', ['oneOf']],
    ['oneOf', '$ref', 'allOf', ['oneOf']],
    ['oneOf', '$ref', 'oneOf', ['oneOf']],
    ['oneOf', '$ref', '$ref', ['oneOf']],

    ['$ref', undefined, undefined, ['model']],
    ['$ref', 'string', undefined, ['model']],
    ['$ref', 'number', undefined, ['model']],
    ['$ref', 'integer', undefined, ['model']],
    ['$ref', 'array', undefined, ['model']],
    ['$ref', 'object', undefined, ['model']],
    ['$ref', 'allOf', undefined, ['model']],
    ['$ref', 'oneOf', undefined, ['model']],
    ['$ref', '$ref', undefined, ['model']],
  ])('should be parse %s > %s > %s', (parent, type, children, names) => {
    const openapi = createOpenapi(createSchema(parent, type
      ? createSchema(type, children
        ? createSchema(children) : undefined, children) : undefined, type));
    const models = parseModel(openapi);
    expect(models.map(({title}) => title)).toHaveLength(8 + names.length);
    expect(models.map(({schema: {type}}) => type))
      .toEqual(['string', 'number', 'number', 'array', 'object', 'allOf', 'oneOf', 'model', ...names]);
  });
});
const createSchema = (type: string, children?: OpenapiSchema, ref: string = 'string'): OpenapiSchema => {
  switch (type) {
    case 'string':
      return {
        type: 'string'
      }
    case 'number':
      return {
        type: 'number'
      }
    case 'integer':
      return {
        type: 'integer'
      }
    case 'array':
      return {
        type: 'array',
        items: children
      }
    case 'object':
      return {
        type: 'object',
        properties: children ? {
          name: children
        } : {}
      }
    case 'allOf':
      return {
        allOf: children ? [children] : []
      }
    case 'oneOf':
      return {
        oneOf: children ? [children] : []
      }
    case '$ref':
      return {
        '$ref': `#/components/schemas/${ref}`
      }
  }
  throw new Error('unknown');
}

const createOpenapi = (schema: OpenapiSchema): Openapi => ({
  openapi: '3.0.3',
  info: {
    title: 'test',
    version: '0.0.1'
  },
  paths: {},
  components: {
    schemas: {
      string: {type: 'string'},
      number: {type: 'number'},
      integer: {type: 'integer'},
      array: {type: 'array'},
      object: {type: 'object'},
      allOf: {allOf: []},
      oneOf: {oneOf: []},
      $ref: {$ref: '#/components/schemas/object'},
      Schema: schema
    }
  }
});
