import {readFile} from "fs-extra";
import {compile} from "handlebars";
import path from "path";
import paths from "../../../paths";
import {OneOfSchema} from "@automatons/typescript-parser";
import {setup} from "../../../generator/setup";

describe('oneOf', () => {
  beforeAll(() => setup());

  it.each<[OneOfSchema, string]>([
    [{type: 'oneOf', schemas: [{type: 'string'}]}, '(string)'],
    [{type: 'oneOf', schemas: [{type: 'number'}]}, '(number)'],
    [{type: 'oneOf', schemas: [{type: 'array'}]}, '(any[])'],
    [{type: 'oneOf', schemas: [{type: 'object'}]}, '(object)'],
    [{type: 'oneOf', schemas: [{type: 'string'}, {type: 'string'}]}, '(string | string)'],
    [{type: 'oneOf', schemas: [{type: 'string'}, {type: 'number'}]}, '(string | number)'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    const data = await readFile(path.resolve(paths.templates, 'models/partials/oneOf.hbs'), {encoding: 'utf-8'});
    expect(compile(data)(schema)).toBe(expected);
  });
});
