import {Automaton, fetch} from "@automatons/tools";
import path from "path";
import {readSetting} from "./setting";
import {remove} from "fs-extra";

const generator = async () => {
  const currentPath = process.cwd();
  const {openapi: openapiPath, automatons} = await readSetting(currentPath);
  const openapi = await fetch(path.resolve(currentPath, openapiPath));
  return Promise.all(automatons.map(async automatonSetting => {
    console.log(automatonSetting.automaton)
    const {default: generator} = (await import(automatonSetting.automaton)) as { default: Automaton };
    await remove(path.resolve(currentPath, automatonSetting.outDir));
    return generator(openapi, {
      outDir: automatonSetting.outDir,
      path: currentPath,
      openapiPath
    }, automatonSetting.options);
  }));
};

export default generator;
