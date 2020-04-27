import {ArraySchema} from "@automatons/typescript-parser";
import {registerPartials} from "../../../generator";


describe('array', () => {
  beforeAll(() => registerPartials());

  it.each <[ArraySchema, string]>([
    [{type: 'array'}, 'expected'],
    [{type: 'array', nullable: true}, 'expected'],
  ])('should be parse. [%p -> %s]', async (schema: ArraySchema, expected: string) => {
    console.log(schema, expected);
  });
});
