import {Automaton} from "@automatons/tools";
import path from "path";
import {readOpenapi} from "./openapi";
import {readSetting} from "./setting";
import {remove} from "fs-extra";

const generator = async () => {
  const {openapi: openapiPath, automatons} = await readSetting(process.cwd());
  const openapi = await readOpenapi(path.resolve(process.cwd(), openapiPath));
  return Promise.all(automatons.map(async automatonSetting => {
    console.log(automatonSetting.automaton)
    const {default: generator} = (await import(automatonSetting.automaton)) as { default: Automaton };
    await remove(path.resolve(process.cwd(), automatonSetting.outDir));
    return generator(openapi, automatonSetting.outDir, automatonSetting.options);
  }));
};
export default generator;
