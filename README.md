# OpenapiAutomatons
[![CI/CD](https://github.com/openapi-automatons/openapi-automatons/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/openapi-automatons/openapi-automatons/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/openapi-automatons/openapi-automatons/branch/main/graph/badge.svg)](https://codecov.io/gh/openapi-automatons/openapi-automatons)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm downloads](https://img.shields.io/npm/dt/openapi-automatons)](https://www.npmjs.com/package/openapi-automatons)

## What OpenapiAutomatons
This library is a generator using openapi file.

## What code can generate?
| name | language | type |
| ---- | -------- | ---- |
| @automatons/typescript-client-axios | typescript | client |

## Get Started
1. Install library to your project
```shell script
yarn add -D openapi-automatons @automatons/typescript-client-axios
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
