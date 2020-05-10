import {OpenapiMap} from "@automatons/tools/dist";

export type ArrayMapItem<T> = {
  key: string;
  schema: T;
}

export const convertMap = <T = any>(map: OpenapiMap<T> = {}): Array<ArrayMapItem<T>> =>
  Object.keys(map).map(key => ({key, schema: map[key]}));
