# testcafe-cli 💎

Run testcafe tests in a beautiful cli with optinal providers.

## Usage

install an NPM package:

`$ yarn add -G @neoskop/testcafe-cli`

and run the CLI directly:

`$ testcafe-cli`

### Additional

create config file `.testcafe-cli.json`:

```json
{
  "testsFolder": "tests",
  "provider": ["browserstack"],
  "env": [
    {
      "type": "select",
      "name": "SUITE",
      "message": "Select Suite",
      "choices": [
        { "title": "Local", "value": "local" },
        { "title": "Stage", "value": "stage" },
        { "title": "Live", "value": "live" }
      ]
    }
  ],
  "vars": {
    "BROWSERSTACK_USERNAME": "",
    "BROWSERSTACK_ACCESS_KEY": "",
    "your_env_vars": "your_env_value"
  }
}
```

for each env you can create one specific question which set as env variabels .

## known issues

browerstack doesent work localy.

## License

This project is under the terms of the Apache License, Version 2.0. A [copy of this license](LICENSE) is included with the sources.
