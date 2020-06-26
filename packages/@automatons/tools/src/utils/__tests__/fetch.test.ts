import {fetch} from "../fetch";
import nodeFetch, {Response} from 'node-fetch';
import {mocked} from "ts-jest/utils";
import {resolve} from "path";

jest.mock('node-fetch');

const mockReadFile = jest.fn(() => Promise.resolve(''));
require('fs-extra').readFile = mockReadFile;

describe('fetch', () => {
  it('should be fetch json file', async () => {
    mockReadFile.mockResolvedValue('{"openapi": "3.0.3"}');
    expect(await fetch('test.json')).toEqual({openapi: '3.0.3'})
  });

  it('should be fetch yml file', async () => {
    mockReadFile.mockResolvedValue('openapi: 3.0.3');
    expect(await fetch('test.yml')).toEqual({openapi: '3.0.3'})
  });

  it('should be throw error if unsupported file', async () => {
    mockReadFile.mockResolvedValue('openapi: 3.0.3');
    await expect(() => fetch('test.txt')).rejects.toThrow('Unsupported file extension')
  });

  it('should be url file', async () => {
    mocked(nodeFetch).mockResolvedValue({text: () => Promise.resolve('{"openapi": "3.0.3"}')} as Response);
    expect(await fetch('http://example.com/test.json')).toEqual({openapi: '3.0.3'})
    expect(mocked(nodeFetch)).toBeCalledWith('http://example.com/test.json');
  });

  it('should be nested file', async () => {
    mockReadFile.mockResolvedValue('{"openapi": "3.0.3"}');
    expect(await fetch('./test.json', './openapi.json')).toEqual({openapi: '3.0.3'})
    expect(mockReadFile).toBeCalledWith(resolve(process.cwd(), 'test.json'), {encoding: 'utf-8'});
    expect(await fetch('../test.json', './test/openapi.json')).toEqual({openapi: '3.0.3'})
    expect(mockReadFile).toBeCalledWith(resolve(process.cwd(), 'test.json'), {encoding: 'utf-8'});
  });

  it('should be url nested file', async () => {
    mocked(nodeFetch).mockResolvedValue({text: () => Promise.resolve('{"openapi": "3.0.3"}')} as Response);
    expect(await fetch('./test.json', 'http://example.com/openapi.json')).toEqual({openapi: '3.0.3'})
    expect(mocked(nodeFetch)).toBeCalledWith('http://example.com/test.json');
    expect(await fetch('../test.json', 'http://example.com/test/openapi.json')).toEqual({openapi: '3.0.3'})
    expect(mocked(nodeFetch)).toBeCalledWith('http://example.com/test.json');
  });

  it('should be nested url', async () => {
    mockReadFile.mockResolvedValue('{"openapi": "3.0.3"}');
    mocked(nodeFetch).mockResolvedValue({text: () => Promise.resolve('{"openapi": "3.0.3"}')} as Response);
    expect(await fetch('http://example.com/openapi.json', './openapi.json')).toEqual({openapi: '3.0.3'})
  });
});
