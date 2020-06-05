import {extractSchema} from "../schema";
import {pascalCase} from "change-case";
import {Model, Schema} from "../../types";
import {AutomatonContext, OpenapiSchema} from "@automatons/tools/dist";

export const extractOfModel = (title: string, schemas: OpenapiSchema[], context: AutomatonContext) => {
  return schemas.map((item, index) =>
    extractSchema(pascalCase([title, index].join(' ')), item, context))
    .reduce<Promise<{ schemas: Schema[], models: Model[], imports: Model[] }>>(async (pre, cur) =>
      ({
        schemas: [...(await pre).schemas, (await cur).schema],
        models: [...(await pre).models, ...(await cur).models],
        imports: [...(await pre).imports, ...((await cur).imports ?? [])]
      }), Promise.resolve({schemas: [], models: [], imports: []}));
}
