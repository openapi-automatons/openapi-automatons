import {Openapi} from './types';

export * from './values';
export * from './types';

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
