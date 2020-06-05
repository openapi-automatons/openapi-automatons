import {pascalCase} from "change-case";
import {convertMap} from "../converters/map";
import {extractModel} from "../extractors/model";
import {Model} from "../types";
import {AutomatonContext} from "@automatons/tools/dist";

export const parseModel = async (context: AutomatonContext): Promise<Model[]> =>
  (await Promise.all(convertMap(context.openapi.components?.schemas)
    .map(({key, schema}) =>
      ({title: pascalCase(schema.title ?? key), schema}))
    .map(async ({title, schema}) => Object.values(await extractModel(title, schema, context)))))
    .flat(2)
