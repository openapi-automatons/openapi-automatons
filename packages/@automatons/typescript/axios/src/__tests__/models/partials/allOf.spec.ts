import {AllOfSchema} from "@automatons/typescript-parser/dist";
import {readFile} from "fs-extra";
import path from "path";
import paths from "../../../paths";
import {compile} from "handlebars";
import {setup} from "../../../generator/setup";

describe('allOf', () => {
  beforeAll(() => setup());

  it.each<[AllOfSchema, string]>([
    [{type: 'allOf', schemas: [{type: 'string'}]}, '(string)'],
    [{type: 'allOf', schemas: [{type: 'number'}]}, '(number)'],
    [{type: 'allOf', schemas: [{type: 'array'}]}, '(any[])'],
    [{type: 'allOf', schemas: [{type: 'object'}]}, '(object)'],
    [{type: 'allOf', schemas: [{type: 'string'}, {type: 'string'}]}, '(string & string)'],
    [{type: 'allOf', schemas: [{type: 'string'}, {type: 'number'}]}, '(string & number)'],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    const data = await readFile(path.resolve(paths.templates, 'models/partials/allOf.hbs'), {encoding: 'utf-8'});
    expect(compile(data)(schema)).toBe(expected);
  });
});
