import {OneOfSchema} from "@automatons/typescript-parser";
import {registerPartials} from "../../../generator";

describe('oneOf', () => {
  beforeAll(() => registerPartials());

  it.each<[OneOfSchema, string]>([
    [{type: 'oneOf', schemas: [{type: 'string'}]}, 'expected'],
    [{type: 'oneOf', schemas: [{type: 'number'}]}, 'expected'],
    [{type: 'oneOf', schemas: [{type: 'array'}]}, 'expected'],
    [{type: 'oneOf', schemas: [{type: 'object'}]}, 'expected'],
    [{type: 'oneOf', schemas: [{type: 'string'}, {type: 'string'}]}, 'expected'],
    [{type: 'oneOf', schemas: [{type: 'string'}, {type: 'number'}]}, 'expected'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    console.log(schema, expected);
  });
});
