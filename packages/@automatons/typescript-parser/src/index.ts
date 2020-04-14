import {Openapi} from "@automatons/tools";
import ModelParser from "./parsers/model";
import {Model} from "./types";

const parser = (openapi: Openapi): { models: Model[] } => {
  const models = new ModelParser(openapi).parse();
  return {models};
}

export default parser;
export * from "./types";