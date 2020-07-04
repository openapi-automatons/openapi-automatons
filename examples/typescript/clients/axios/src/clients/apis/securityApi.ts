import { AxiosResponse, AxiosRequestConfig } from "axios";
import { AbstractApi, AbstractConfig } from "./abstractApi";
import { Config, Security } from "../config";
import { template } from "../utils";

type TestServer = { name: "Test"; values: { lang: "ja" | "en" } };

/**
 * SecurityApi
 */
export class SecurityApi extends AbstractApi {
  readonly #config: SecurityApiConfig;

  constructor(config: Config) {
    super(config);
    this.#config = new SecurityApiConfig(config.security);
  }

  /**
   * http
   * @async
   */
  public async http(
    headers: {
      "Content-Type": "application/json";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    const path = "/securities/http";
    const requestConfig = await this.#config.http(headers, server, config);
    return this.axios.get(path, requestConfig);
  }

  /**
   * apiKey
   * @async
   */
  public async apiKey(
    headers: {
      "Content-Type": "application/json";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    const path = "/securities/apiKey";
    const requestConfig = await this.#config.apiKey(headers, server, config);
    return this.axios.get(path, requestConfig);
  }

  /**
   * oauth2
   * @async
   */
  public async oauth2(
    headers: {
      "Content-Type": "application/json";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    const path = "/securities/oauth2";
    const requestConfig = await this.#config.oauth2(headers, server, config);
    return this.axios.get(path, requestConfig);
  }

  /**
   * openIdConnect
   * @async
   */
  public async openIdConnect(
    headers: {
      "Content-Type": "application/json";
    } = { "Content-Type": "application/json" },
    server: TestServer = { name: "Test", values: { lang: "en" } },
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    const path = "/securities/openIdConnect";
    const requestConfig = await this.#config.openIdConnect(
      headers,
      server,
      config
    );
    return this.axios.get(path, requestConfig);
  }
}

class SecurityApiConfig extends AbstractConfig {
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

  public async http(
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
      auth: await this.security("http"),
      baseURL: config?.baseURL
        ? config.baseURL
        : SecurityApiConfig.server(server),
      params,
      headers: _headers,
    };
  }

  public async apiKey(
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
    _headers["Header"] = await this.security("apiKey");

    return {
      ...config,
      baseURL: config?.baseURL
        ? config.baseURL
        : SecurityApiConfig.server(server),
      params,
      headers: _headers,
    };
  }

  public async oauth2(
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
    _headers["Authorization"] = `Bearer ${await this.security("oauth2", [
      "pet:write",
    ])}`;

    return {
      ...config,
      baseURL: config?.baseURL
        ? config.baseURL
        : SecurityApiConfig.server(server),
      params,
      headers: _headers,
    };
  }

  public async openIdConnect(
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
    _headers["Authorization"] = `Bearer ${await this.security(
      "openIdConnect",
      []
    )}`;

    return {
      ...config,
      baseURL: config?.baseURL
        ? config.baseURL
        : SecurityApiConfig.server(server),
      params,
      headers: _headers,
    };
  }
}
