import { AxiosResponse, AxiosRequestConfig } from "axios";
import { AbstractApi, AbstractConfig } from "./abstractApi";
import { Config, Security } from "../config";
import { template, formData } from "../utils";
import { Pet } from "../models";
import { PetModel } from "../models";

type TestServer = { name: "Test"; values: { lang: "ja" | "en" } };

/**
 * OwnerApi
 */
export class OwnerApi extends AbstractApi {
  readonly #config: OwnerApiConfig;

  constructor(config: Config) {
    super(config);
    this.#config = new OwnerApiConfig(config.security);
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
}

class OwnerApiConfig extends AbstractConfig {
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
      baseURL: config?.baseURL ? config.baseURL : OwnerApiConfig.server(server),
      params,
      headers: _headers,
    };
  }
}
