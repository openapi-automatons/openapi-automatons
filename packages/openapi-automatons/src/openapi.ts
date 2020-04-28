import fs from 'fs-extra';
import Yaml from 'js-yaml';
import {Openapi} from "@automatons/tools";
import path from "path";

export const readOpenapi = (openapiPath: string) =>
  fs.readFile(openapiPath, {encoding: 'utf-8'})
    .then<Openapi>((data) => {
      switch (path.extname(openapiPath)) {
        case '.json':
          return JSON.parse(data);
        case '.yml':
        case '.yaml':
          return Yaml.safeLoad(data);
        default:
          throw new Error('Unsupported file extension');
      }
    });
