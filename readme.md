# Severstal
[Посмотреть тестовое задание](./docs/test-task.md)


## Build

> We use node version 16+

Download the dependencies:

```bash
npm ci
```

To run compile the Typescript:

```bash
npm run build
```

Remove dependencies for development:

```bash
npm ci --omit=dev
```

To run the application:

```bash
node build/index.js url region
```
