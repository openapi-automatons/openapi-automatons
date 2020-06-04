import {Openapi} from '@automatons/tools';
import {CLIEngine} from 'eslint';
import {remove} from "fs-extra";
import generatorTypescriptAxios from './index';
import paths from "./paths";

it('should generate.', async () => {
  const linter = new CLIEngine({cwd: paths.tmp, rules: {quotes: [2, "double"]}});

  await generatorTypescriptAxios(minimumOpenapi, {path: '', openapiPath: '', outDir: paths.tmp}, undefined);
  const report = linter.executeOnFiles(['**/*']);

  report.results
    .filter(result => result.errorCount !== 0 || result.warningCount !== 0)
    .forEach(result => {
      const {messages, source} = result;
      console.log({messages: messages.map(message => message.message).join("\n"), source});
    })

  expect(report.errorCount).toBe(0);
  expect(report.warningCount).toBe(0);
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
