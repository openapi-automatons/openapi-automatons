import {mocked} from "ts-jest/utils";
import mockGenerator from "../__mocks__/@automatons/client-typescript-axios"
import {generate} from "../generate";
import {readSettings} from "../settings";
import settings from './examples/automatons.json';
import openapi from './examples/v3_0/petstore.json';

jest.mock('@automatons/client-typescript-axios')
jest.mock('../settings');

it('should be generate', async () => {
  await Promise.all(await generate());
  expect(mockGenerator)
    .toBeCalledWith(openapi, {
      openapiPath: settings.openapi,
      outDir: settings.automatons?.[0].outDir,
      path: process.cwd()
    }, undefined)
});

it('should be error if invalid openapi', () => {
  mocked(readSettings).mockReturnValue(
    Promise.resolve({...settings, openapi: './src/__tests__/examples/invalid_schema.json'}))
  expect(() => generate())
    .rejects.toThrow('Invalid schema in openapi.\n' +
    '#/components/type: [validate error] #/$defs/components/unevaluatedProperties')
});
