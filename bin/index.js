#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var prompts_1 = __importDefault(require("prompts"));
var testcafe_1 = __importDefault(require("testcafe"));
var providerPool = __importStar(require("testcafe/lib/browser/provider/pool"));
var testcafe;
var availableBrowsers = { local: [], browserstack: [] };
function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs_1["default"].readdirSync(dir);
    for (var i in files) {
        var name_1 = dir + '/' + files[i];
        if (fs_1["default"].statSync(name_1).isDirectory()) {
            getFiles(name_1, files_);
        }
        else {
            files_.push(name_1);
        }
    }
    return files_;
}
function getBrowserList() {
    return __awaiter(this, void 0, void 0, function () {
        var locallcyProvider, browserstackProvider, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, providerPool.getProvider('locally-installed')];
                case 1:
                    locallcyProvider = _b.sent();
                    return [4 /*yield*/, providerPool.getProvider('browserstack')];
                case 2:
                    browserstackProvider = _b.sent();
                    _a = {};
                    return [4 /*yield*/, locallcyProvider.getBrowserList()];
                case 3:
                    _a.local = (_b.sent()).map(function (name) {
                        return { title: name, value: name };
                    });
                    return [4 /*yield*/, browserstackProvider.getBrowserList()];
                case 4:
                    availableBrowsers = (_a.browserstack = (_b.sent()).map(function (name) {
                        return { title: name, value: "browserstack:" + name };
                    }),
                        _a);
                    return [2 /*return*/];
            }
        });
    });
}
var files = getFiles(path_1["default"].resolve('tests'));
var filesAsArray = files.map(function (file) {
    return { title: file, value: file };
});
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        var testFiles, provider, browsers, suite, runner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBrowserList()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prompts_1["default"]({
                            type: 'select',
                            name: 'value',
                            message: 'Select Testfile',
                            choices: filesAsArray
                        })];
                case 2:
                    testFiles = _a.sent();
                    if (!testFiles)
                        return [2 /*return*/];
                    return [4 /*yield*/, prompts_1["default"]({
                            type: 'select',
                            name: 'value',
                            message: 'Select Provider',
                            choices: [
                                { title: 'Local', value: 'local' },
                                { title: 'Browserstack', value: 'browserstack' },
                            ]
                        })];
                case 3:
                    provider = _a.sent();
                    if (!provider)
                        return [2 /*return*/];
                    return [4 /*yield*/, prompts_1["default"]({
                            type: 'autocomplete',
                            name: 'value',
                            message: 'Select Browser',
                            choices: availableBrowsers[provider.value]
                        })];
                case 4:
                    browsers = _a.sent();
                    if (!browsers)
                        return [2 /*return*/];
                    return [4 /*yield*/, prompts_1["default"]({
                            type: 'select',
                            name: 'value',
                            message: 'Select Suite',
                            choices: [
                                { title: 'Local', value: 'local' },
                                { title: 'Stage', value: 'stage' },
                                { title: 'Live', value: 'live' },
                            ]
                        })];
                case 5:
                    suite = _a.sent();
                    if (!suite)
                        return [2 /*return*/];
                    runner = { value: false };
                    if (!(provider.value === 'local')) return [3 /*break*/, 7];
                    return [4 /*yield*/, prompts_1["default"]({
                            type: 'toggle',
                            name: 'value',
                            message: 'Live Mode?',
                            initial: false,
                            active: 'yes',
                            inactive: 'no'
                        })];
                case 6:
                    runner = _a.sent();
                    if (!runner)
                        return [2 /*return*/];
                    _a.label = 7;
                case 7: return [2 /*return*/, {
                        browsers: browsers.value,
                        testFiles: testFiles.value,
                        suite: suite.value,
                        runner: runner.value
                    }];
            }
        });
    });
}
function executeScript() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getData().then(function (data) {
                        if (data && data.browsers && data.testFiles && data.suite) {
                            process.env.SUITE = data.suite;
                            process.env.BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
                            process.env.BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;
                            testcafe_1["default"]('localhost', 1337, 1338)
                                .then(function (tc) {
                                var runner = data.runner
                                    ? tc.createLiveModeRunner()
                                    : tc.createRunner();
                                return runner
                                    .src(data.testFiles)
                                    .browsers(data.browsers)
                                    .run();
                            })
                                .then(function () {
                                if (testcafe)
                                    testcafe.close();
                                process.exit(0);
                            });
                        }
                        else {
                            console.error('something went wrong');
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
executeScript();
