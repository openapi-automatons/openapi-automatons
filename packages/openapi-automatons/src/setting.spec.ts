import {readSetting} from "./setting";

const mockReadFile = jest.fn(() => Promise.resolve('{\n' +
  '  "openapi": "openapi.yml",\n' +
  '  "automatons": [{\n' +
  '    "automaton": "@automatons/typescript-axios",\n' +
  '    "outDir": "src/apis"\n' +
  '  }]\n' +
  '}\n'));
require('fs-extra').readFile = mockReadFile;

describe('setting', () => {
  it('should be validate setting.', async () => {
    expect(await readSetting('/path/to/automaton'))
      .toEqual({
        openapi: "openapi.yml",
        automatons: [{
          automaton: "@automatons/typescript-axios",
          outDir: "src/apis"
        }]
      });
    expect(mockReadFile).toBeCalledWith('/path/to/automaton/automatons.json', {encoding: 'utf-8'});
  });

  it('should be invalid schema throw error.', async () => {
    mockReadFile.mockReturnValue(Promise.resolve("{}"));
    await expect(readSetting('/path/to/automaton')).rejects.toThrow();
  });
});
