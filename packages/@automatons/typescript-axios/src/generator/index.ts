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
  register('models/type'),
  register('validators/allOf'),
  register('validators/array'),
  register('validators/number'),
  register('validators/object'),
  register('validators/oneOf'),
  register('validators/string'),
  register('validators/title'),
  register('validators/type'),
]);

export const generate = async (openapi: Openapi, outDir: string) => {
  const promises: Promise<void>[] = [];
  await registerPartials();

  const {models} = parser(openapi);
  if (models.length) {
    promises.push(write('models/index.hbs', [outDir, 'models', 'index.ts'], models))
    promises.push(write('validators/index.hbs', [outDir, 'validators', 'index.ts'], models))
    const modelPromises = models
      .map(model => [
        write('models/model.hbs', [outDir, 'models', `${model.filename}.ts`], model),
        write('validators/validator.hbs', [outDir, 'validators', `${model.filename}.ts`], model),
      ]).flat();
    promises.push(...modelPromises)
  }
  promises.push(write('index.hbs', [outDir, 'index.ts']), write('config.hbs', [outDir, 'config.ts']));
  return Promise.all(promises)
};
