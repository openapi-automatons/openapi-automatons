import {Model, Schema} from "./model";

export interface Api {
  title: string;
  filename: string;
  servers: Server[];
  imports: Model[];
  paths: Path[]
}

export type Path = ReceivePath | AffectPath;

export type ReceivePath = {
  name: string;
  method: 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch';
  path: string;
  servers: Server[];
  parameters?: PathParameter[];
  queries?: QueryParameter[];
  headers?: HeaderParameter[];
  cookies?: CookieParameter[];
  schema?: Schema;
  securities?: Security[];
}

export type AffectPath = {
  name: string;
  method: 'post' | 'put' | 'patch';
  path: string;
  servers: Server[];
  forms?: Form[];
  parameters?: PathParameter[];
  queries?: QueryParameter[];
  headers?: HeaderParameter[];
  cookies?: CookieParameter[];
  schema?: Schema;
  securities?: Security[];
}

export type Form = {
  types: string[];
  required?: boolean;
  schema: Schema;
};

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

export type Security = ApiKeySecurity | HttpSecurity | Oauth2Security | OpenIdConnectSecurity;

export type ApiKeySecurity = {
  name: string;
  type: 'apiKey';
  key: string;
  in: "query" | "header" | "cookie";
  description?: string;
};

export type HttpSecurity = {
  name: string;
  type: 'http';
  schema: 'basic' | 'bearer';
  description?: string;
};

export type Oauth2Security = {
  name: string;
  type: 'oauth2';
  scopes: string[];
  description?: string;
};

export type OpenIdConnectSecurity = {
  name: string;
  type: 'openIdConnect';
  description?: string;
};
