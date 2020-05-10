import {Openapi} from "@automatons/tools";
import {ApiParser} from "./parsers/api";
import ModelParser from "./parsers/model";
import {Model, Api} from "./types";

const parser = (openapi: Openapi): { models: Model[], apis: Api[] } => {
  const {models, map} = new ModelParser(openapi).parse();
  const apis = new ApiParser(openapi, map).parse();
  return {models, apis};
}

export default parser;
export * from "./types";
