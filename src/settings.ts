import type {Setting} from '@automatons/tools';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {z} from 'zod';

const schema = z.object({
  openapi: z.string(),
  automatons: z.array(z.object({
    automaton: z.string(),
    outDir: z.string(),
  })).min(1),
});

const validate = (data: string): Setting => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    throw new Error(`Invalid schema in automatons.json.\n${e}`);
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Invalid schema in automatons.json.\n${result.error}`);
  }
  return result.data as Setting;
};

export const readSettings = async (current: string): Promise<Setting> => {
  const settingPath = resolve(current, 'automatons.json');
  const data = await readFile(settingPath, {encoding: 'utf-8'})
    .catch(() => {
      throw new Error(`automatons.json is not found.\nneed to make automatons.json into ${current}.`);
    });
  return validate(data);
};
