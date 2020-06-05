import fs from 'fs-extra';
import {Openapi, parseFile} from "@automatons/tools";

export const readOpenapi = (openapiPath: string) =>
  fs.readFile(openapiPath, {encoding: 'utf-8'})
    .then<Openapi>((data) => parseFile(data, openapiPath));
