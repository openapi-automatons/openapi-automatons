import path from "path";
import {safeLoad} from "js-yaml";
import {Openapi} from "../types";

export const parseFile = (data: string, filePath: string): Openapi => {
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
