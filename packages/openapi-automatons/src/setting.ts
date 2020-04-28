import fs from "fs-extra";
import path from "path";
import * as Yup from "yup";
import {AutomatonSetting, Setting} from "@automatons/tools";

const fields = {
  openapi: Yup.string().required(),
  automatons: Yup.array().of<AutomatonSetting>(Yup.object({
    automaton: Yup.string().required(),
    outDir: Yup.string().required()
  })).min(1)
};

export const validate = (obj: object) => Yup.object<Setting>(fields).validate(obj);
export const readSetting = (current: string) => fs.readFile(path.resolve(current, 'automatons.json'), {encoding: 'utf-8'})
  .then(data => validate(JSON.parse(data)));
