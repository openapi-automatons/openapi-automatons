import {NumberSchema} from "@automatons/typescript-parser/dist";
import {registerPartials} from "../../../generator";

describe('number', () => {
  beforeAll(() => registerPartials());

  it.each<[NumberSchema, string]>([
    [{type: 'number'}, 'expected'],
    [{type: 'number', nullable: true}, 'expected'],
    [{type: 'number', enum: [1, 2]}, 'expected'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    console.log(schema, expected);
  });
});
