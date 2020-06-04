export * from './values';
export * from './types';
export * from './utils';

export type Setting = {
  openapi: string;
  automatons: AutomatonSetting[]
}

export type AutomatonSetting = {
  automaton: string;
  outDir: string;
  options?: object;
}
