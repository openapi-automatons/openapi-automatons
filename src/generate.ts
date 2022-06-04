import path from 'path';
import {remove} from 'fs-extra';
import {fetch} from '@automatons/tools';
import {validator} from '@automatons/validator';
import {readSettings} from './settings';
import type {Automaton} from '@automatons/tools';
import type {Validate} from '@automatons/validator';

export const generate = async () => {
  const currentPath = process.cwd();
  const {openapi: openapiPath, automatons} = await readSettings(currentPath);
  const openapi = await fetch(openapiPath, currentPath);

  const result = await validator(openapi);
  if (!result.valid) {
    throw new Error(`Invalid schema in openapi.\n${validateMessages(result.errors)}`);
  }

  return automatons.map(async (automatonSetting) => {
    const {default: generator} = (await import(automatonSetting.automaton)) as { default: Automaton };
    await remove(path.resolve(currentPath, automatonSetting.outDir));
    return generator(openapi, {
      outDir: automatonSetting.outDir,
      path: currentPath,
      openapiPath,
    }, automatonSetting.options);
  });
};

const validateMessages = (messages: Validate[]) =>
  messages.map(({location, rule, keyword}) =>
    `${location}: [${keyword} error] #${rule}`).join('\n');
