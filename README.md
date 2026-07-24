# OpenapiAutomatons
[![CI/CD](https://github.com/openapi-automatons/openapi-automatons/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/openapi-automatons/openapi-automatons/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/openapi-automatons/openapi-automatons/branch/main/graph/badge.svg)](https://codecov.io/gh/openapi-automatons/openapi-automatons)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm downloads](https://img.shields.io/npm/dt/openapi-automatons)](https://www.npmjs.com/package/openapi-automatons)

## What is OpenapiAutomatons
This library is a generator using openapi file.

## Requirements
Since v2 this package is **ESM-only** and requires **Node.js >= 22**. Use it from an ESM project (or import it dynamically). v1.x (CommonJS) remains available for older setups.

## What code can generate?
| name | language | type |
| ---- | -------- | ---- |
| [@automatons/typescript-client-axios](https://github.com/openapi-automatons/typescript-client-axios) | typescript | client (axios) |
| [@automatons/typescript-client-fetch](https://github.com/openapi-automatons/typescript-client-fetch) | typescript | client (standard `fetch`) |
| [@automatons/typescript-client-react-query](https://github.com/openapi-automatons/typescript-client-react-query) | typescript | client (TanStack Query hooks) |
| [@automatons/typescript-zod](https://github.com/openapi-automatons/typescript-zod) | typescript | schema (zod) |
| [@automatons/typescript-server-nestjs](https://github.com/openapi-automatons/typescript-server-nestjs) | typescript | server (NestJS) |
| [@automatons/typescript-server-nextjs](https://github.com/openapi-automatons/typescript-server-nextjs) | typescript | server (Next.js App Router) |

## Get Started
1. Install library to your project
```shell script
yarn add -D openapi-automatons @automatons/typescript-client-axios
# or, for the dependency-free fetch client:
# yarn add -D openapi-automatons @automatons/typescript-client-fetch
```

2. Create settings in your project root `automatons.json`
```json
{
  "openapi": "openapi.yml",
  "automatons": [{
    "automaton": "@automatons/typescript-client-axios",
    "outDir": "src/clients"
  }]
}
```

3. Add generate command your package.json
```json:package.json
{
  "scripts": {
    "generate": "openapi-automatons"
  }
}
```

## Automatons.json
| property |     | type | required | description |
| -------- | --- | ---- | -------- | ----------- |
| openapi | | string | true | This is openapi path. It can be relative or absolute. Also, there is no problem with the url format.|
| automatons | | array | true | This is the property that contains the module. |
| automatons | automaton | string | true | This is the module name. You can embed your own module. It is also possible to include it with a relative path. |
| automatons | outDir | string | true | This is the output directory of module. |

## OpenAPI support

`openapi-automatons` reads OpenAPI **3.0**, **3.1**, and **3.2** documents (3.0 and 3.1 are
schema-validated; 3.2 documents are accepted). The TypeScript client generators support:

- **Schema types** — `string`, `number`, `integer`, `boolean`, `object`, `array`, `enum`,
  `allOf` (rendered as an intersection), `oneOf` / `anyOf` (rendered as a union), and `$ref`.
  From JSON Schema 2020-12 (3.1): nullable via `type: ["...", "null"]` (and the 3.0 `nullable`),
  and `const` (a single-value literal). String formats `date` / `date-time` map to `Date`, and
  `url` to `URL`.
- **Operations** — `get`, `put`, `post`, `delete`, `options`, `head`, `patch`, `trace`, plus the
  3.2 `query` method and `additionalOperations` (arbitrary HTTP verbs).
- **Parameters** — `path`, `query`, `header`, `cookie`, and the 3.2 `querystring` parameter
  (serialized as `application/x-www-form-urlencoded`).
- **Request bodies** — `application/json`, `multipart/form-data`, `application/x-www-form-urlencoded`.
- **Security schemes** — `apiKey` (header / query / cookie), `http` (basic / bearer), `oauth2`,
  and `openIdConnect`.
- **Servers** — server variables, and naming via the 3.2 `name` field (falling back to the
  `x-name` extension, then the URL).

### Not supported yet
Webhooks, streaming media types (`itemSchema` / Server-Sent Events / JSON Lines), hierarchical
tags (`parent` / `kind`), `$self`, the OAuth 2.0 device authorization flow, XML serialization,
and `discriminator` mapping (`oneOf` / `anyOf` are emitted as a plain TypeScript union).
