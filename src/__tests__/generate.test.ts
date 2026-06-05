import {beforeEach, expect, it, vi} from 'vitest';
import {generate} from '../generate';
import {readSettings} from '../settings';
import settings from './examples/automatons.json';
import openapi from './examples/v3_0/petstore.json';

const {generator} = vi.hoisted(() => ({generator: vi.fn()}));
vi.mock('@automatons/client-typescript-axios', () => ({default: generator}));
vi.mock('../settings');

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readSettings).mockResolvedValue(settings as never);
});

it('should be generate', async () => {
  await Promise.all(await generate());
  expect(generator)
    .toBeCalledWith(openapi, {
      openapiPath: settings.openapi,
      outDir: settings.automatons?.[0].outDir,
      path: process.cwd(),
    }, undefined);
});

it('should be generate with remote yaml', async () => {
  vi.mocked(readSettings).mockResolvedValue({
    ...settings,
    openapi: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/3.0.4/examples/v3.0/petstore.yaml',
  } as never);
  await Promise.all(await generate());
  expect(generator)
    .toBeCalledWith(openapi, {
      openapiPath: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/3.0.4/examples/v3.0/petstore.yaml',
      outDir: settings.automatons?.[0].outDir,
      path: process.cwd(),
    }, undefined);
});

it('should be error if invalid openapi', () => {
  vi.mocked(readSettings).mockResolvedValue({
    ...settings,
    openapi: './src/__tests__/examples/invalid_schema.json',
  } as never);
  return expect(() => generate())
    .rejects.toThrow('Invalid schema in openapi.\n' +
    '#/components/type: [validate error] #/$defs/components/unevaluatedProperties');
});
