import {Openapi} from '@automatons/tools';
import {CLIEngine} from 'eslint';
import {remove} from "fs-extra";
import generatorTypescriptAxios from './index';
import paths from "./paths";

it('should generate.', async () => {
  const linter = new CLIEngine({cwd: paths.tmp, rules: {quotes: [2, "double"]}});

  await generatorTypescriptAxios(minimumOpenapi, paths.tmp, undefined);
  const report = linter.executeOnFiles(['**/*']);
  console.log(report);
  expect(report.errorCount).toBe(0);
  expect(report.warningCount).toBe(0);
});

afterEach(async () => {
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
