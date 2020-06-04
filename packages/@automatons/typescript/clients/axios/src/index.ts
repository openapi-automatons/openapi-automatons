import {Automaton} from "@automatons/tools";
import {generate} from "./generator";


const generatorTypescriptAxios: Automaton = (openapi, settings) =>
  generate(openapi, settings);

export default generatorTypescriptAxios;
