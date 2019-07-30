# testcafe-browserstack-cli 💎

Run testcafe tests in a beautiful cli.

## Requirements

### Folder structure for tests:

```
test/
├── test1/
|   └── test.ts
├── test2/
|   ├── test.ts
|   └── test.stage.ts
└── test3/
    ├── test.ts
    └── test.live.ts
```

## Usage

install an NPM package:

`$ yarn add -G @neoskop/testcafe-browserstack-cli`

add local env variables:
`$ export BROWSERSTACK_USERNAME=<username> && export BROWSERSTACK_ACCESS_KEY=<key>`

and run the CLI directly:

`$ testcafe-cli`

### Additional

u can use the local variable `process.env.SUITE` with state `<'local'|'stage'|'live'>`

## License

This project is under the terms of the Apache License, Version 2.0. A [copy of this license](LICENSE) is included with the sources.
