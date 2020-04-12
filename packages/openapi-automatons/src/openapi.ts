import fs from 'fs';
import yaml from 'js-yaml';
import {Openapi} from "@automatons/tools";

export const readOpenapi = (openapiPath: string) => new Promise<string>((resolve, reject) =>
    fs.readFile(openapiPath,
        {encoding: 'utf-8'},
        (err, data) => err ? reject(err) : resolve(data)))
    .then<Openapi>(yaml.safeLoad);
