import path from "path";
import {ensureDir, readFile, writeFile} from "fs-extra";
import {format} from "prettier";
import paths from "../paths";
import {compile} from "handlebars";

export async function write(template: string, outDir: string | string[], context?: any) {
  const outputPath = Array.isArray(outDir) ? path.resolve(...outDir) : outDir;
  await ensureDir(path.dirname(outputPath));
  const data = await readFile(path.resolve(paths.templates, template), {encoding: 'utf-8'});
  return writeFile(outputPath, format(compile(data)(context), {parser: 'typescript'}));
}
