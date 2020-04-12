import {Openapi} from './openapi';
export * from './openapi';
export * as utils from './utils';

export type Automaton = (openapi: Openapi,
                         outDir: string,
                         options: object | undefined) => any
export type Setting = {
  openapi: string;
  automatons: AutomatonSetting[]
}
export type AutomatonSetting = {
  automaton: string;
  outDir: string;
  options?: object;
}
