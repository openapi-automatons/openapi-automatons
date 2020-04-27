import {StringSchema} from "@automatons/typescript-parser";
import {registerPartials} from "../../../generator";

describe('string', () => {
  beforeAll(() => registerPartials());

  it.each<[StringSchema, string]>([
    [{type: 'string'}, 'expected'],
    [{type: 'string', nullable: true}, 'expected'],
    [{type: 'string', enum: ['one', 'two']}, 'expected'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    console.log(schema, expected);
  });
});
