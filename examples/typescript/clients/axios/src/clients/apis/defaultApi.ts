import { AxiosResponse, AxiosRequestConfig } from "axios";
import { AbstractApi, AbstractConfig } from "./abstractApi";
import { Config, Security } from "../config";
import { template } from "../utils";

type TestServer = { name: "Test"; values: { lang: "ja" | "en" } };

/**
 * DefaultApi
 */
export class DefaultApi extends AbstractApi {
  readonly #config: DefaultApiConfig;

  constructor(config: Config) {
    super(config);
    this.#config = new DefaultApiConfig(config.security);
  }

  /**
   * deletePet
   * @async
   */
  public async deletePet(
    id: number,
    headers: {
      "Content-Type": "application/json";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    const path = "/pets/{id}".replace(
      "{id}",
      template("id", id, "simple", false)
    );
    const requestConfig = await this.#config.deletePet(headers, server, config);
    return this.axios.delete(path, requestConfig);
  }
}

class DefaultApiConfig extends AbstractConfig {
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

  public async deletePet(
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
      baseURL: config?.baseURL
        ? config.baseURL
        : DefaultApiConfig.server(server),
      params,
      headers: _headers,
    };
  }
}
