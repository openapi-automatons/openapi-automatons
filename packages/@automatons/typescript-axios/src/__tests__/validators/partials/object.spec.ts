import {ObjectSchema} from "@automatons/typescript-parser/dist";
import {registerPartials} from "../../../generator";

describe('object', () => {
  beforeAll(() => registerPartials());

  it.each<[ObjectSchema, string]>([
    [{type: 'object'}, 'expected'],
    [{type: 'object', nullable: true}, 'expected'],
    [{type: 'object', properties: [{name: 'name', required: true, schema: {type: 'string'}}]}, "expected"],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    console.log(schema, expected);
  });
});
