import {readFile} from "fs-extra";
import {compile} from "handlebars";
import path from "path";
import {registerPartials} from "../../../generator";
import paths from "../../../paths";
import {StringSchema} from "@automatons/typescript-parser";

describe('string', () => {
  beforeAll(() => registerPartials());

  it.each<[StringSchema, string]>([
    [{type: 'string'}, 'string'],
    [{type: 'string', nullable: true}, 'string | null'],
    [{type: 'string', enum: ['one', 'two']}, '"one" | "two"'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    const data = await readFile(path.resolve(paths.templates, 'models/partials/string.hbs'), {encoding: 'utf-8'});
    expect(compile(data)(schema)).toBe(expected);
  });
});