# Typescript CommonJS and ESM Builder for Node.js

![GitHub license](https://img.shields.io/github/license/fgiova/cjs-esm-ts-builder.svg)
[![NPM version](https://img.shields.io/npm/v/@fgiova/cjs-esm-ts-builder.svg?style=flat)](https://www.npmjs.com/package/@fgiova/cjs-esm-ts-builder)
![CI workflow](https://github.com/fgiova/cjs-esm-ts-builder/actions/workflows/node.js.yml/badge.svg)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)


## Description
This module is a Typescript CommonJS and ESM Builder for Node.js. 
It provides a simple way to build your Typescript projects as CommonJS and ESM modules. 
It uses `tsc` and default tsconfig.json to build the project then rewrote import and export of esm files adding .mjs extension and indexes.

## Install
```bash
npm i @fgiova/cjs-esm-ts-builder
```
## CLI usage
```bash
npx @fgiova/cjs-esm-ts-builder
```
or
```bash
npm install --save-dev @fgiova/cjs-esm-ts-builder
esmBuilder
```
### Cli options
- `--target`: The target version of ECMAScript to compile to. Default is `es2020`.
- `--esmFolder`: The folder where the ESM files will be generated. Default is `esm`.
- `--cjsFolder`: The folder where the CommonJS files will be generated. Default is `cjs`.
- `--buildFolder`: The folder where the build files will be generated. Default is `dist`.
- `--help`: Show help message.



## Programmatic usage
```js
const { build } = require("@fgiova/cjs-esm-ts-builder");

const options = {
    target: "es2020",
    esmFolder: "esm",
    cjsFolder: "cjs",
    buildFolder: "dist"
};

build(options)
    .then(() => {
        console.log("Build completed");
    })
    .catch((err) => {
        console.error(err);
    });
```

## Configure package.json
```json
{
    ...
    "main": "./dist/cjs/index.js",
    "types": "./dist/cjs/index.d.ts",
    "exports": {
        ".": {
            "import": {
                "types": "./dist/esm/index.d.mts",
                "default": "./dist/esm/index.mjs"
            },
            "require": {
                "types": "./dist/cjs/index.d.ts",
                "default": "./dist/cjs/index.js"
            }
        }
    },
    "files": [
        "dist"
    ],
    ...
}
```

## Options
- `target`: The target version of ECMAScript to compile to. Default is `es2020`.
- `esmFolder`: The folder where the ESM files will be generated. Default is `esm`.
- `cjsFolder`: The folder where the CommonJS files will be generated. Default is `cjs`.
- `buildFolder`: The folder where the build files will be generated. Default is `dist`.


## Notes
- Tested with Node.js >= 20
- Work only on *nix systems (Linux, MacOS, etc.)

## License
Licensed under [MIT](./LICENSE).