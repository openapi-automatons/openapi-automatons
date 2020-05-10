import {OpenapiMap} from "@automatons/tools/dist";

export type ArrayMap<T> = {
  key: string;
  schema: T;
}

export const convertMap = <T = any>(map: OpenapiMap<T> = {}): Array<ArrayMap<T>> =>
  Object.keys(map).map(key => ({key, schema: map[key]}));
