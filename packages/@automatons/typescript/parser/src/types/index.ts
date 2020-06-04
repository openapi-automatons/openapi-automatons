import {Openapi, OpenapiSchema, AutomatonSettings} from "@automatons/tools";

export * from "./api";
export * from "./model";
export type NamedSchema = { title: string, schema: OpenapiSchema };

export type Context = {
  openapi: Openapi;
  settings: AutomatonSettings;
}
