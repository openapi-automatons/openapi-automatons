import {Model, Schema} from "./model";

export interface Api {
  title: string;
  filename: string;
  imports: Model[];
  paths: Path[]
}

export interface Path {
  name: string;
  method: 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch';
  path: string;
  parameters?: PathParameter[];
  queries?: [];
  headers?: [];
  schema?: Schema;
}

export type PathParameter = {
  name: string;
  schema: Schema;
  style: 'simple' | 'label' | 'matrix';
  explode?: boolean;
};
