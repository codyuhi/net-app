# todo

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Get API Server Working

1. Install dev dependencies:
    - ts-node
    - typescript
2. Add a `tsconfig.json` to the `api` directory:
    ```json
    {
      "compilerOptions": {
        "lib": ["es2019", "es2020.bigint", "es2020.string", "es2020.symbol.wellknown"],
        "module": "commonjs",
        "target": "es2019",

        "noImplicitAny": true,
        "preserveConstEnums": true,
        "removeComments": true,
        "esModuleInterop": true,

        "declaration": true,
        "sourceMap": true
      },

      "include": [
        "./**/*"
      ]
    }
    ```
3. Create a VS Code launch configuration for debugging.
    ```json
    {
      "name": "Run API",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npx",
      "runtimeArgs": [
        "ts-node",
        "--files",
        "--project",
        "api/tsconfig.json",
        "api/index.ts"
      ]
    }
    ```