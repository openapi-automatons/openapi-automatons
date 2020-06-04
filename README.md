# OpenapiAutomatons
[![test](https://github.com/tanmen/openapi-automatons/workflows/test/badge.svg)](https://github.com/tanmen/openapi-automatons/actions?query=workflow%3Atest)
[![codecov](https://codecov.io/gh/tanmen/openapi-automatons/branch/master/graph/badge.svg)](https://codecov.io/gh/tanmen/openapi-automatons)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## What OpenapiAutomatons
This library is a generator using openapi file.

## Get Started
```shell script
yarn add -D openapi-automatons @automatons/typescript-axios
```

create file in your package.json dir
```json:automatons.json
{
  "openapi": "openapi.yml",
  "automatons": [{
    "automaton": "@automatons/typescript-axios",
    "outDir": "src/clients"
  }]
}
```
