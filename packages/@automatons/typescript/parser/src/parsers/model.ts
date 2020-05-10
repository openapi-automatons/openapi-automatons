import {Openapi} from "@automatons/tools/dist";
import {pascalCase} from "change-case";
import {convertMap} from "../converters/map";
import {extractModel} from "../extractors/model";
import {Model} from "../types";

export const parseModel = (openapi: Openapi): Model[] =>
  convertMap(openapi.components?.schemas)
    .map(({key, schema}) =>
      ({title: pascalCase(schema.title ?? key), schema}))
    .map(({title, schema}) => Object.values(extractModel(title, schema, openapi)))
    .flat(2)
