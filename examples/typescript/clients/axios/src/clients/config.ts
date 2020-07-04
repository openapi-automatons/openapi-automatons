import { AxiosInstance } from "axios";

export type Security = {
  http:
    | { username: string; password: string }
    | Promise<{ username: string; password: string }>
    | (() =>
        | { username: string; password: string }
        | Promise<{ username: string; password: string }>);
  apiKey: string | Promise<string> | (() => string | Promise<string>);
  oauth2:
    | string
    | Promise<string>
    | ((scopes?: string[]) => string | Promise<string>);
  openIdConnect:
    | string
    | Promise<string>
    | ((scopes?: string[]) => string | Promise<string>);
};

export type Config = {
  axios?: AxiosInstance;
  token?: string | Promise<string> | (() => string | Promise<string>);
  security?: Security;
};
