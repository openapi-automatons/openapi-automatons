import fs from "fs";
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
const readFile = (current: string) =>
    new Promise<string>((resolve, reject) =>
        fs.readFile(path.resolve(current, 'automatons.json'),
            {encoding: 'utf-8'},
            (err, data) => err ? reject(err) : resolve(data)))
        .then(file => JSON.parse(file));

export const validate = (obj: object) => Yup.object<Setting>(fields).validate(obj);
export const readSetting = (current: string) => readFile(current).then(validate);
