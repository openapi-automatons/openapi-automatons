import {Automaton} from "@automatons/tools";
import {generate} from "./generator";


const generatorTypescriptAxios: Automaton = (openapi, outDir) =>
  generate(openapi, outDir);

export default generatorTypescriptAxios;
