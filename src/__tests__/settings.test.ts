import { join } from "path";
import {readSettings} from "../settings";

const mockReadFile = jest.fn(() => Promise.resolve('{\n' +
  '  "openapi": "openapi.yml",\n' +
  '  "automatons": [{\n' +
  '    "automaton": "@automatons/typescript-axios",\n' +
  '    "outDir": "src/apis"\n' +
  '  }]\n' +
  '}\n'));
const mockExistsFile = jest.fn(() => Promise.resolve(true));
require('fs-extra').readFile = mockReadFile;
require('fs-extra').pathExists = mockExistsFile;

it("should be read settings", async () => {
  expect(await readSettings('/path/to/automaton'))
    .toEqual({
      openapi: "openapi.yml",
      automatons: [{
        automaton: "@automatons/typescript-axios",
        outDir: "src/apis"
      }]
    });
  expect(mockReadFile).toBeCalledWith('/path/to/automaton/automatons.json', {encoding: 'utf-8'});
})

it('should be invalid schema throw error.', async () => {
  mockReadFile.mockReturnValue(Promise.resolve("{}"));
  await expect(readSettings('/path/to/automaton')).rejects
    .toThrow('Invalid schema in automatons.json.');
});

it('should be throw error if not found.', async () => {
  mockExistsFile.mockReturnValue(Promise.resolve(false))
  await expect(readSettings(join(process.cwd(), 'dummy'))).rejects
    .toThrow(
    'automatons.json is not found.');
});
