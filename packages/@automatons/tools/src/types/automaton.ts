import {Openapi} from "./openapi";

export type AutomatonContext = {
  openapi: Openapi;
  settings: AutomatonSettings;
}

export type AutomatonSettings = {
  outDir: string;
  path: string;
  openapiPath: string;
}

export type Automaton = (openapi: Openapi,
                         settings: AutomatonSettings,
                         options: object | undefined) => unknown
