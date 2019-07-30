#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import prompts, { PromptObject } from 'prompts';
import createTestCafe from 'testcafe';
import * as providerPool from 'testcafe/lib/browser/provider/pool';
const config: IConfig = {
    testsFolder: "tests",
    provider: ["browserstack"],
    env: [
        {
            type: "select",
            name: "SUITE",
            message: "Select Suite",
            choices: [
                { title: "Local", "value": "local" },
                { title: "Stage", "value": "stage" },
                { title: "Live", "value": "live" }
            ]
        }
    ],
    vars: {
        BROWSERSTACK_USERNAME: '',
        BROWSERSTACK_ACCESS_KEY: ''
    },
    ...getConfig()
};

let testcafe: TestCafe;

interface IConfig {
    testsFolder: string;
    provider: string[];
    env: PromptObject[]
    vars: { [key: string]: string }
}

function getConfig(): Partial<IConfig> {
    try {
        return require(`${__dirname}/.testcafe-cli.json`);
    } catch {
        return {};
    }
}

function getFiles(dir: any, files_?: any) {
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files) {
        let name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

async function getBrowserList(providerName: string) {
    const provider = await providerPool.getProvider(providerName);

    return (await provider.getBrowserList()).map((name: string) => ({ title: name, value: name }));
}

async function getData() {
    const response = await prompts([{
        type: 'select',
        name: 'testfile',
        message: 'Select Testfile',
        choices: getFiles(path.resolve(config.testsFolder)).map((file: string) => ({ title: file, value: file }))
    },
    {
        type: 'select',
        name: 'provider',
        message: 'Select Provider',
        choices: [
            { title: 'locally-installed', value: 'locally-installed' },
            ...config.provider.map((provider: string) => ({ title: provider, value: provider }))
        ],
    }]);
    if (!response) return

    const browser = await prompts({
        type: 'autocomplete',
        name: 'browser',
        message: 'Select Browser',
        choices: await getBrowserList(response.provider),
    })
    if (!browser) return

    const liveMode = response.provider === 'locally-installed' && await prompts({
        type: 'toggle',
        name: 'liveMode',
        message: 'Live Mode?',
        initial: false,
        active: 'yes',
        inactive: 'no',
    })
    if (!liveMode) return

    const envs = await prompts(config.env)

    return { ...response, ...browser, ...liveMode, envs };
}

function setEnvs(envs) {
    const keys = Object.keys(envs)
    keys.forEach((key, _idx) => {
        process.env[key] = envs[key]
    })
}

async function executeScript() {
    await getData().then(data => {

        if (!data.browser) {
            console.log('no browser');
            return
        }

        if (!data.testfile) {
            console.log('no testfile');
            return
        }


        setEnvs({ ...data.envs, ...config.vars })


        createTestCafe('localhost', 1337, 1338)
            .then(tc => {
                const runner = data.liveMode
                    ? tc.createLiveModeRunner()
                    : tc.createRunner();

                return runner
                    .src(data.testfile)
                    .browsers(data.browser)
                    .run();
            })
            .then(() => {
                if (testcafe) testcafe.close();
                process.exit(0);
            });

    });
}

executeScript();
