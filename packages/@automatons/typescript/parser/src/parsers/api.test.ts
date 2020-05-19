import {Openapi} from "@automatons/tools";
import {parseApi} from "./api";

describe('api parser', () => {
  it('should be parse api', () => {
    const {apis} = parseApi(createOpenapi());
    expect(apis).toEqual([{
      title: 'DefaultApi',
      filename: 'defaultApi',
      servers: [],
      imports: [],
      paths: [
        {
          method: 'get',
          name: 'getTests',
          parameters: [],
          queries: [],
          headers: [],
          cookies: [],
          path: 'tests',
          schema: {
            type: 'string',
            format: undefined,
            defaultValue: undefined,
            deprecated: undefined,
            description: undefined,
            enum: [],
            examples: undefined,
            nullable: undefined,
            readOnly: undefined,
            writeOnly: undefined,
          },
          servers: []
        }
      ]
    }])
  });
});

const createOpenapi = (): Openapi => ({
  openapi: '3.0.3',
  info: {
    title: 'test',
    version: '0.0.1'
  },
  paths: {
    tests: {
      get: {
        operationId: "getTests",
        responses: {
          200: {
            description: 'test list',
            content: {
              'application/json': {
                schema: {type: 'string'}
              }
            }
          }
        }
      }
    }
  },
  components: {}
});
