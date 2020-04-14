import {readFile} from "fs-extra";
import path from "path";
import paths from "../paths";
import {registerPartial} from "handlebars";

export async function register(name: string) {
  const data = await readFile(path.resolve(paths.templates, `${(path.dirname(name))}/partials/${path.basename(name)}.hbs`), {encoding: 'utf-8'});
  registerPartial(name, data);
}
