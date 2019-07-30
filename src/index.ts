#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import createTestCafe from 'testcafe';
import * as providerPool from 'testcafe/lib/browser/provider/pool';
import { resolve } from 'url';


let testcafe: TestCafe;
let availableBrowsers: any = { local: [], browserstack: [] };

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

async function getBrowserList() {
    const locallcyProvider = await providerPool.getProvider('locally-installed');
    const browserstackProvider = await providerPool.getProvider('browserstack');

    availableBrowsers = {
        local: (await locallcyProvider.getBrowserList()).map((name: string) => {
            return { title: name, value: name };
        }),
        browserstack: (await browserstackProvider.getBrowserList()).map(
            (name: string) => {
                return { title: name, value: `browserstack:${name}` };
            }
        ),
    };
}

const files: string[] = getFiles(path.resolve('tests'));

const filesAsArray = files.map((file: string) => {
    return { title: file, value: file };
});

async function getData() {
    await getBrowserList();

    const testFiles = await prompts({
        type: 'select',
        name: 'value',
        message: 'Select Testfile',
        choices: filesAsArray,
    });
    if (!testFiles) return;

    const provider = await prompts({
        type: 'select',
        name: 'value',
        message: 'Select Provider',
        choices: [
            { title: 'Local', value: 'local' },
            { title: 'Browserstack', value: 'browserstack' },
        ],
    });
    if (!provider) return;

    const browsers = await prompts({
        type: 'autocomplete',
        name: 'value',
        message: 'Select Browser',
        choices: availableBrowsers[provider.value],
    });
    if (!browsers) return;

    const suite = await prompts({
        type: 'select',
        name: 'value',
        message: 'Select Suite',
        choices: [
            { title: 'Local', value: 'local' },
            { title: 'Stage', value: 'stage' },
            { title: 'Live', value: 'live' },
        ],
    });
    if (!suite) return;
    let runner: { value: boolean } = { value: false };

    if (provider.value === 'local') {
        runner = await prompts({
            type: 'toggle',
            name: 'value',
            message: 'Live Mode?',
            initial: false,
            active: 'yes',
            inactive: 'no',
        });
        if (!runner) return;
    }

    return {
        browsers: browsers.value,
        testFiles: testFiles.value,
        suite: suite.value,
        runner: runner.value,
    };
}

async function executeScript() {
    await getData().then(data => {
        if (data && data.browsers && data.testFiles && data.suite) {
            process.env.SUITE = data.suite;
            process.env.BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
            process.env.BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;


            createTestCafe('localhost', 1337, 1338)
                .then(tc => {
                    const runner = data.runner
                        ? tc.createLiveModeRunner()
                        : tc.createRunner();

                    return runner
                        .src(data.testFiles)
                        .browsers(data.browsers)
                        .run();
                })
                .then(() => {
                    if (testcafe) testcafe.close();
                    process.exit(0);
                });
        } else {
            console.error('something went wrong');
        }
    });
}

executeScript();
