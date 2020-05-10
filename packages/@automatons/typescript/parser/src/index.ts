import {Openapi} from "@automatons/tools";
import {parseApi} from "./parsers/api";
import {parseModel} from "./parsers/model";
import {Api, Model} from "./types";

const parser = (openapi: Openapi): { models: Model[], apis: Api[] } => {
  const models = parseModel(openapi);
  const {apis, models: apiModels} = parseApi(openapi);
  return {models: [...models, ...apiModels], apis};
}

export default parser;
export * from "./types";
