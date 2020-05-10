import {readFile} from "fs-extra";
import {compile} from "handlebars";
import path from "path";
import {registerPartials} from "../../../generator";
import paths from "../../../paths";
import {ObjectSchema} from "@automatons/typescript-parser/dist";

describe('object', () => {
  beforeAll(() => registerPartials());

  it.each<[ObjectSchema, string]>([
    [{type: 'object'}, 'object'],
    [{type: 'object', nullable: true}, 'object | null'],
    [{type: 'object', properties: [{name: 'name', required: true, schema: {type: 'string'}}]}, "{\n" +
    "  /**\n" +
    "   * name\n" +
    "   */\n" +
    "  name: string;\n" +
    "}"],
  ])('should be parse. [%p -> %s]', async (schema, expected) => {
    const data = await readFile(path.resolve(paths.templates, 'models/partials/object.hbs'), {encoding: 'utf-8'});
    expect(compile(data)(schema)).toBe(expected);
  });
});
