import Axios, { AxiosInstance } from "axios";
import { Config, Security } from "../config";

const DateFormat = /^\d{4}-\d{2}-\d{2}([tT]\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})|Z)?$/;
const reviver = (_key: string, value: any) =>
  typeof value === "string" && DateFormat.test(value) ? new Date(value) : value;

const BASE_AXIOS = Axios.create({
  transformResponse: (data) => JSON.parse(data, reviver),
});

export class AbstractConfig {
  readonly #security?: Security;

  constructor(security?: Security) {
    this.#security = security;
  }

  protected async security(
    key: "http"
  ): Promise<{ username: string; password: string }>;
  protected async security(key: "apiKey"): Promise<string>;
  protected async security(key: "oauth2", scopes: string[]): Promise<string>;
  protected async security(
    key: "openIdConnect",
    scopes: string[]
  ): Promise<string>;
  protected async security(
    key: keyof Security,
    scopes?: string[]
  ): Promise<string | { username: string; password: string }> {
    const security = this.#security?.[key];
    if (!security) {
      throw new Error("Unauthorized user request.");
    } else if (security instanceof Function) {
      return scopes ? security(scopes) : security();
    }
    return security;
  }
}

export class AbstractApi {
  protected axios: AxiosInstance = BASE_AXIOS;

  constructor({ axios }: Config) {
    if (axios) this.axios = axios;
  }
}
