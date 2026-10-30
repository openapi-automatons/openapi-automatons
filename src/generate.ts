import path from 'node:path';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
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
    const specifier = resolveAutomaton(automatonSetting.automaton, currentPath);
    const {default: generator} = (await import(specifier)) as { default: Automaton };
    await rm(path.resolve(currentPath, automatonSetting.outDir), {recursive: true, force: true});
    return generator(openapi, {
      outDir: automatonSetting.outDir,
      path: currentPath,
      openapiPath,
    }, automatonSetting.options);
  });
};

// import() resolves relative specifiers against this module, not the cwd, and
// rejects Windows absolute paths, so file paths go through a file URL.
const resolveAutomaton = (automaton: string, currentPath: string) =>
  /^\.\.?([\\/]|$)/.test(automaton) || path.isAbsolute(automaton)
    ? pathToFileURL(path.resolve(currentPath, automaton)).href
    : automaton;

const validateMessages = (messages: Validate[]) =>
  messages.map(({location, rule, keyword}) =>
    `${location}: [${keyword} error] #${rule}`).join('\n');
