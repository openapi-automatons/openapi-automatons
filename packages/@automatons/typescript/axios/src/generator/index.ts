import {Openapi} from "@automatons/tools";
import parser from "@automatons/typescript-parser";
import HB from 'handlebars';

import helpers from 'handlebars-helpers';
import {register} from "./register";
import {write} from "./writer";

helpers({handlebars: HB});

export const registerPartials = () => Promise.all([
  register('models/allOf'),
  register('models/array'),
  register('models/nullable'),
  register('models/number'),
  register('models/object'),
  register('models/oneOf'),
  register('models/string'),
  register('models/type'),
  register('comment'),
  register('apis/path'),
  register('apis/server'),
]);

export const generate = async (openapi: Openapi, outDir: string) => {
  const promises: Promise<void>[] = [];
  await registerPartials();

  const {models, apis} = parser(openapi);
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
    write('config.hbs', [outDir, 'config.ts'])
  );
  return Promise.all(promises)
};
