import {pascalCase} from "change-case";
import {convertMap} from "../converters/map";
import {extractModel} from "../extractors/model";
import {Context, Model} from "../types";

export const parseModel = ({openapi}: Context): Model[] =>
  convertMap(openapi.components?.schemas)
    .map(({key, schema}) =>
      ({title: pascalCase(schema.title ?? key), schema}))
    .map(({title, schema}) => Object.values(extractModel(title, schema, openapi)))
    .flat(2)
