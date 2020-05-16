import {readFile} from "fs-extra";
import {compile} from "handlebars";
import path from "path";
import paths from "../../../paths";
import {StringSchema} from "@automatons/typescript-parser";
import {setup} from "../../../generator/setup";

describe('string', () => {
  beforeAll(() => setup());

  it.each<[StringSchema, string]>([
    [{type: 'string'}, 'string'],
    [{type: 'string', nullable: true}, 'string | null'],
    [{type: 'string', enum: ['one', 'two']}, '"one" | "two"'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    const data = await readFile(path.resolve(paths.templates, 'models/partials/string.hbs'), {encoding: 'utf-8'});
    expect(compile(data)(schema)).toBe(expected);
  });
});
