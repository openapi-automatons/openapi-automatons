import {AllOfSchema} from "@automatons/typescript-parser/dist";
import {registerPartials} from "../../../generator";

describe('allOf', () => {
  beforeAll(() => registerPartials());

  it.each<[AllOfSchema, string]>([
    [{type: 'allOf', schemas: [{type: 'string'}]}, 'expected'],
    [{type: 'allOf', schemas: [{type: 'number'}]}, 'expected'],
    [{type: 'allOf', schemas: [{type: 'array'}]}, 'expected'],
    [{type: 'allOf', schemas: [{type: 'object'}]}, 'expected'],
    [{type: 'allOf', schemas: [{type: 'string'}, {type: 'string'}]}, 'expected'],
    [{type: 'allOf', schemas: [{type: 'string'}, {type: 'number'}]}, 'expected'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    console.log(schema, expected);
  });
});
