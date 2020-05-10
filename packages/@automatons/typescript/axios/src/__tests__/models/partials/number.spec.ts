import {readFile} from "fs-extra";
import {compile} from "handlebars";
import path from "path";
import {registerPartials} from "../../../generator";
import paths from "../../../paths";
import {NumberSchema} from "@automatons/typescript-parser/dist";

describe('number', () => {
  beforeAll(() => registerPartials());

  it.each<[NumberSchema, string]>([
    [{type: 'number'}, 'number'],
    [{type: 'number', nullable: true}, 'number | null'],
    [{type: 'number', enum: [1, 2]}, '1 | 2'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    const data = await readFile(path.resolve(paths.templates, 'models/partials/number.hbs'), {encoding: 'utf-8'});
    expect(compile(data)(schema)).toBe(expected);
  });
});
