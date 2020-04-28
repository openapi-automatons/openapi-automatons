import {readOpenapi} from "./openapi";

const mockReadFile = jest.fn(() => Promise.resolve(''));
require('fs-extra').readFile = mockReadFile;

describe('openapi', () => {
  it('should be read json.', async () => {
    mockReadFile.mockResolvedValue('{"openapi": "3.0.3"}');
    const openapi = await readOpenapi('test.json');
    expect(openapi).toEqual({openapi: '3.0.3'});
  });
  it('should be read yaml.', async () => {
    mockReadFile.mockResolvedValue('openapi: 3.0.3');
    const openapi = await readOpenapi('test.yaml');
    expect(openapi).toEqual({openapi: '3.0.3'});
  });
  it('should be read yml.', async () => {
    mockReadFile.mockResolvedValue('openapi: 3.0.3');
    const openapi = await readOpenapi('test.yml');
    expect(openapi).toEqual({openapi: '3.0.3'});
  });
  it('should be throw error if unsupported file.', () =>
    expect(() => readOpenapi('test.txt')).rejects.toThrow('Unsupported file extension'))
});
