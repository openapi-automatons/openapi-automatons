import {Openapi} from '@automatons/tools';
import {ESLint} from 'eslint';
import {remove} from "fs-extra";
import generatorTypescriptAxios from './index';
import paths from "./paths";

it('should generate.', async () => {
  const linter = new ESLint({cwd: paths.tmp});

  await generatorTypescriptAxios(minimumOpenapi, {path: '', openapiPath: '', outDir: paths.tmp}, undefined);
  const results = await linter.lintFiles(['**/*']);

  results
    .filter(result => result.errorCount !== 0 || result.warningCount !== 0)
    .forEach(result => {
      expect(result).toBeUndefined();
      const {messages, source} = result;
      console.log({messages: messages.map(message => message.message).join("\n"), source});
    })
});

afterAll(async () => {
  await remove(paths.tmp);
});

const minimumOpenapi: Openapi = {
  openapi: '3.0.3',
  info: {
    title: 'example',
    version: '0.0.0'
  },
  paths: {}
};
