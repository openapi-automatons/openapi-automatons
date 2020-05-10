import {Model} from "./model";

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
  model?: Model;
}
