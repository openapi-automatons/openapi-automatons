import path from "path";
import {safeLoad} from "js-yaml";
import {Openapi} from "../types";

export const parseFile = <T = Openapi>(data: string, filePath: string): T => {
  switch (path.extname(filePath)) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
    case '.yaml':
      return safeLoad(data);
    default:
      throw new Error('Unsupported file extension');
  }
};
