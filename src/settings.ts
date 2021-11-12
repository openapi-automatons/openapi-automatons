import type {AutomatonSetting, Setting} from "@automatons/tools";
import fs from "fs-extra";
import path from "path";
import {array, object, string} from "yup";

const schema = object({
  openapi: string().required(),
  automatons: array().of<AutomatonSetting>(object({
    automaton: string().required(),
    outDir: string().required()
  })).min(1)
});

const validate = (file: any): Promise<Setting> => schema.validate(file)
  .catch(e => {
    throw new Error(`Invalid schema in automatons.json.\n${e}`)
  })

export const readSettings = async (current: string): Promise<Setting> => {
  const settingPath = path.resolve(current, 'automatons.json');
  const exists = await fs.pathExists(settingPath)
  if (!exists)
    throw new Error(`automatons.json is not found.\nneed to make automatons.json into ${current}.`)

  return fs.readFile(settingPath, {encoding: 'utf-8'})
    .then(validate)
}
