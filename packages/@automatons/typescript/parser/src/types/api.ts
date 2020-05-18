import {Model, Schema} from "./model";

export interface Api {
  title: string;
  filename: string;
  servers: Server[];
  imports: Model[];
  paths: Path[]
}

export interface Path {
  name: string;
  method: 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch';
  path: string;
  servers: Server[];
  parameters?: PathParameter[];
  queries?: QueryParameter[];
  headers?: HeaderParameter[];
  cookies?: CookieParameter[];
  schema?: Schema;
}

export type Server = {
  name: string;
  url: string;
  values?: ServerValue[];
};

export type ServerValue = {
  name: string;
  defaultValue: string;
  enums: string[];
}

export type PathParameter = {
  name: string;
  schema: Schema;
  style: 'simple' | 'label' | 'matrix';
  explode?: boolean;
};

export type QueryParameter = {
  name: string;
  schema: Schema;
  style: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
  required?: boolean;
  explode?: boolean;
};

export type HeaderParameter = {
  name: string;
  schema: Schema;
  style: 'simple';
  required?: boolean;
  explode?: boolean;
};

export type CookieParameter = {
  name: string;
  schema: Schema;
  style: 'form';
  required?: boolean;
  explode?: boolean;
};
