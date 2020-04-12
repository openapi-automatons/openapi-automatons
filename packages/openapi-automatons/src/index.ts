import {Automaton} from "@automatons/tools";
import path from "path";
import {readOpenapi} from "./openapi";
import {readSetting} from "./setting";

const generator = async () => {
  const {openapi: openapiPath, automatons} = await readSetting(process.cwd());
  const openapi = await readOpenapi(path.resolve(process.cwd(), openapiPath));
  return Promise.all(automatons.map(async automatonSetting => {
    const {default: generator} = (await import(automatonSetting.automaton)) as { default: Automaton };
    return generator(openapi, automatonSetting.outDir, automatonSetting.options);
  }));
};
export default generator;
