import {OpenapiServer} from "@automatons/tools/dist";
import {Server} from "../types";
import {convertMap} from "./map";
import {pascalCase} from "change-case";

export const convertServer = (schema: OpenapiServer): Server => ({
  name: pascalCase(schema['x-name'] ?? schema.url),
  url: schema.url,
  values: convertMap(schema.variables).map(({key, schema}) =>
    ({name: key, defaultValue: schema.default, enums: schema.enum}))
})
