import {Openapi} from "@automatons/tools";
import {parseApi} from "./parsers/api";
import {parseModel} from "./parsers/model";
import {Api, Model, Security} from "./types";
import {convertSecurity} from "./converters/security";

const parser = (openapi: Openapi): { models: Model[], apis: Api[], securities: Security[] } => {
  const models = parseModel(openapi);
  const {apis, models: apiModels} = parseApi(openapi);
  const securities = Object.entries(openapi.components?.securitySchemes ?? {})
    .map(([key, schema]) => convertSecurity(key, schema, []))
    .filter<Security>((value): value is Security => value !== undefined);
  return {models: [...models, ...apiModels], apis, securities};
}

export default parser;
export * from "./types";
