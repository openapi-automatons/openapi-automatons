import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {beforeEach, expect, it, vi} from 'vitest';
import {readSettings} from '../settings';

vi.mock('node:fs/promises', () => ({readFile: vi.fn()}));
const mockReadFile = vi.mocked(readFile);

const valid = '{\n' +
  '  "openapi": "openapi.yml",\n' +
  '  "automatons": [{\n' +
  '    "automaton": "@automatons/typescript-axios",\n' +
  '    "outDir": "src/apis"\n' +
  '  }]\n' +
  '}\n';

beforeEach(() => {
  vi.clearAllMocks();
  mockReadFile.mockResolvedValue(valid as never);
});

it('should be read settings', async () => {
  expect(await readSettings('/path/to/automaton'))
    .toEqual({
      openapi: 'openapi.yml',
      automatons: [{
        automaton: '@automatons/typescript-axios',
        outDir: 'src/apis',
      }],
    });
  expect(mockReadFile).toBeCalledWith('/path/to/automaton/automatons.json', {encoding: 'utf-8'});
});

it('should be invalid schema throw error.', async () => {
  mockReadFile.mockResolvedValue('{}' as never);
  await expect(readSettings('/path/to/automaton')).rejects
    .toThrow('Invalid schema in automatons.json.');
});

it('should be throw error if not found.', async () => {
  mockReadFile.mockRejectedValue(new Error('ENOENT'));
  await expect(readSettings(join(process.cwd(), 'dummy'))).rejects
    .toThrow('automatons.json is not found.');
});
