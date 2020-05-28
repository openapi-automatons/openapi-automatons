import {Openapi} from "@automatons/tools";
import parser from "@automatons/typescript-parser";
import {write} from "./writer";
import {setup} from "./setup";


export const generate = async (openapi: Openapi, outDir: string) => {
  const promises: Promise<void>[] = [];
  await setup();

  const {models, apis, securities} = parser(openapi);
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
    promises.push(...apis.map(api => write('apis/api.hbs', [outDir, 'apis', `${api.filename}.ts`], api)));
  }

  promises.push(
    write('index.hbs', [outDir, 'index.ts'], {api: apis.length, model: models.length}),
    write('config.hbs', [outDir, 'config.ts'], {securities})
  );
  return Promise.all(promises)
};
