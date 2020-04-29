import HB from 'handlebars';
import {register} from "./register";

import helpers from 'handlebars-helpers';
import parser from "@automatons/typescript-parser";
import {Openapi} from "@automatons/tools";
import {write} from "./writer";

helpers({handlebars: HB});

export const registerPartials = () => Promise.all([
  register('models/allOf'),
  register('models/array'),
  register('models/comment'),
  register('models/nullable'),
  register('models/number'),
  register('models/object'),
  register('models/oneOf'),
  register('models/string'),
  register('models/type')
]);

export const generate = async (openapi: Openapi, outDir: string) => {
  const promises: Promise<void>[] = [];
  await registerPartials();

  const {models} = parser(openapi);
  if (models.length) {
    promises.push(write('models/index.hbs', [outDir, 'models', 'index.ts'], models))
    const modelPromises = models
      .map(model => write('models/model.hbs', [outDir, 'models', `${model.filename}.ts`], model));
    promises.push(...modelPromises)
  }
  promises.push(write('index.hbs', [outDir, 'index.ts']), write('config.hbs', [outDir, 'config.ts']));
  return Promise.all(promises)
};
