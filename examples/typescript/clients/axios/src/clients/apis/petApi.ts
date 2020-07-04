import { AxiosResponse, AxiosRequestConfig } from "axios";
import { AbstractApi, AbstractConfig } from "./abstractApi";
import { Config, Security } from "../config";
import { template, query, formData } from "../utils";
import { PetModel } from "../models";
import { Pet } from "../models";

type TestServer = { name: "Test"; values: { lang: "ja" | "en" } };

/**
 * PetApi
 */
export class PetApi extends AbstractApi {
  readonly #config: PetApiConfig;

  constructor(config: Config) {
    super(config);
    this.#config = new PetApiConfig(config.security);
  }

  /**
   * findPets
   * @async
   */
  public async findPets(
    queries: { limit?: number; tags?: Array<string>; name?: string } = {},
    headers: {
      "Content-Type": "application/json";
      csrf?: string;
    } = { "Content-Type": "application/json" },
    cookies: { cookie_csrf?: string } = {},
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Array<PetModel>>> {
    const path = "/pets";
    const requestConfig = await this.#config.findPets(
      queries,
      headers,
      cookies,
      server,
      config
    );
    return this.axios.get(path, requestConfig);
  }

  /**
   * addPet
   * @async
   */
  public async addPet(
    form: Pet,
    headers?: {
      "Content-Type": "application/json" | "application/text";
    },
    server?: TestServer,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<PetModel>>;
  public async addPet(
    form: PetModel,
    headers: {
      "Content-Type": "multipart/form-data";
    },
    server?: TestServer,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<PetModel>>;
  public async addPet(
    form: Pet | PetModel,
    headers: {
      "Content-Type":
        | "application/json"
        | "application/text"
        | "multipart/form-data";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<PetModel>> {
    const path = "/pets";
    const requestConfig = await this.#config.addPet(headers, server, config);
    const _form = formData(headers["Content-Type"], form);
    return this.axios.post(path, _form, requestConfig);
  }

  /**
   * findPetById
   * @async
   */
  public async findPetById(
    id: number,
    headers: {
      "Content-Type": "application/json";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<PetModel>> {
    const path = "/pets/{id}".replace(
      "{id}",
      template("id", id, "simple", false)
    );
    const requestConfig = await this.#config.findPetById(
      headers,
      server,
      config
    );
    return this.axios.get(path, requestConfig);
  }
}

class PetApiConfig extends AbstractConfig {
  constructor(security?: Security) {
    super(security);
  }

  private static server(server: TestServer) {
    if ("Test" === server.name) {
      return "https://{lang}.example.com/tanmen/openapi-automatons".replace(
        "{lang}",
        template("lang", server.values.lang, "simple", false)
      );
    }
    throw new Error("Undefined server. please define server.");
  }

  public async findPets(
    queries: { limit?: number; tags?: Array<string>; name?: string } = {},
    headers: {
      "Content-Type": "application/json";
      csrf?: string;
    } = { "Content-Type": "application/json" },
    cookies: { cookie_csrf?: string } = {},
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const params = {
      ...config?.params,
      ...query("limit", queries.limit, "form", false),
      ...query("tags", queries.tags, "form", false),
      ...query("name", queries.name, "form", false),
    };
    const _cookies = { ...config?.headers?.Cookie };
    if (cookies.cookie_csrf) {
      _cookies["cookie_csrf"] = query(
        "cookie_csrf",
        cookies.cookie_csrf,
        "form",
        false
      );
    }

    const _headers = {
      ...config?.headers,
      "Content-Type": headers["Content-Type"],
      Cookie: _cookies,
    };
    if (headers.csrf) {
      _headers["csrf"] = template("csrf", headers.csrf, "simple", false);
    }
    _headers["Header"] = await this.security("apiKey");

    return {
      ...config,
      baseURL: config?.baseURL ? config.baseURL : PetApiConfig.server(server),
      params,
      headers: _headers,
    };
  }

  public async addPet(
    headers: {
      "Content-Type":
        | "application/json"
        | "application/text"
        | "multipart/form-data";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const params = {
      ...config?.params,
    };
    const _cookies = { ...config?.headers?.Cookie };

    const _headers = {
      ...config?.headers,
      "Content-Type": headers["Content-Type"],
      Cookie: _cookies,
    };

    return {
      ...config,
      baseURL: config?.baseURL ? config.baseURL : PetApiConfig.server(server),
      params,
      headers: _headers,
    };
  }

  public async findPetById(
    headers: {
      "Content-Type": "application/json";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const params = {
      ...config?.params,
    };
    const _cookies = { ...config?.headers?.Cookie };

    const _headers = {
      ...config?.headers,
      "Content-Type": headers["Content-Type"],
      Cookie: _cookies,
    };

    return {
      ...config,
      baseURL: config?.baseURL ? config.baseURL : PetApiConfig.server(server),
      params,
      headers: _headers,
    };
  }
}
