import {Openapi, AutomatonSettings} from "@automatons/tools";
import parser from "@automatons/typescript-parser";
import {write} from "./writer";
import {setup} from "./setup";
import {extractApiMeta} from "../extractors/api";


export const generate = async (openapi: Openapi, settings: AutomatonSettings) => {
  const {outDir} = settings;
  const promises: Promise<void>[] = [];
  await setup();

  const {models, apis, securities} = parser(openapi, settings);
  if (models.length) {
    promises.push(write('models/index.hbs', [outDir, 'models', 'index.ts'], models))
    const modelPromises = models
      .map(model => write('models/model.hbs', [outDir, 'models', `${model.filename}.ts`], model));
    promises.push(...modelPromises)
  }

  if (apis.length) {
    promises.push(
      write('apis/index.hbs', [outDir, 'apis', 'index.ts'], apis),
      write('apis/abstractApi.hbs', [outDir, 'apis', 'abstractApi.ts']),
    );
    promises.push(...apis.map(api => write('apis/api.hbs', [outDir, 'apis', `${api.filename}.ts`], {api, meta: extractApiMeta(api)})));
  }

  promises.push(
    write('index.hbs', [outDir, 'index.ts'], {api: apis.length, model: models.length}),
    write('config.hbs', [outDir, 'config.ts'], {securities}),
    write('utils/index.hbs', [outDir, 'utils', 'index.ts']),
    write('utils/template.hbs', [outDir, 'utils', 'template.ts']),
    write('utils/query.hbs', [outDir, 'utils', 'query.ts']),
    write('utils/formData.hbs', [outDir, 'utils', 'formData.ts'])
  );
  return Promise.all(promises)
};
