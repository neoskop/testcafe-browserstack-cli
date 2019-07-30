#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var config = __assign({ testsFolder: "tests", provider: ["browserstack"], env: [
        {
            type: "select",
            name: "SUITE",
            message: "Select Suite",
            choices: [
                { title: "Local works not with browserstack", value: "local" },
                { title: "Stage", value: "stage" },
                { title: "Live", value: "live" }
            ]
        }
    ], vars: {
        BROWSERSTACK_USERNAME: '',
        BROWSERSTACK_ACCESS_KEY: ''
    } }, getConfig());
var testcafe;
function getConfig() {
    try {
        return require(path_1["default"].resolve('.testcafe-cli.json'));
    }
    catch (_a) {
        return {};
    }
}
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
function getBrowserList(providerName) {
    return __awaiter(this, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, providerPool.getProvider(providerName)];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, provider.getBrowserList()];
                case 2: return [2 /*return*/, (_a.sent()).map(function (name) { return ({ title: name, value: "" + (providerName != 'locally-installed' ? providerName + ":" : '') + name }); })];
            }
        });
    });
}
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, browserName, _a, _b, liveMode, envs;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, prompts_1["default"]([{
                            type: 'select',
                            name: 'testfile',
                            message: 'Select Testfile',
                            choices: getFiles(path_1["default"].resolve(config.testsFolder)).map(function (file) { return ({ title: file, value: file }); })
                        },
                        {
                            type: 'select',
                            name: 'provider',
                            message: 'Select Provider',
                            choices: [
                                { title: 'locally-installed', value: 'locally-installed' }
                            ].concat(config.provider.map(function (provider) { return ({ title: provider, value: provider }); }))
                        }])];
                case 1:
                    response = _c.sent();
                    if (!response)
                        return [2 /*return*/];
                    _a = prompts_1["default"];
                    _b = {
                        type: 'autocomplete',
                        name: 'browser',
                        message: 'Select Browser'
                    };
                    return [4 /*yield*/, getBrowserList(response.provider)];
                case 2: return [4 /*yield*/, _a.apply(void 0, [(_b.choices = _c.sent(),
                            _b)])];
                case 3:
                    browserName = _c.sent();
                    if (!browserName)
                        return [2 /*return*/];
                    liveMode = { liveMode: false };
                    if (!(response.provider === 'locally-installed')) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompts_1["default"]({
                            type: 'toggle',
                            name: 'liveMode',
                            message: 'Live Mode?',
                            initial: false,
                            active: 'yes',
                            inactive: 'no'
                        })];
                case 4:
                    liveMode = _c.sent();
                    if (!liveMode)
                        return [2 /*return*/];
                    _c.label = 5;
                case 5: return [4 /*yield*/, prompts_1["default"](config.env)];
                case 6:
                    envs = _c.sent();
                    return [2 /*return*/, __assign({}, response, browserName, liveMode, { envs: envs })];
            }
        });
    });
}
function setEnvs(envs) {
    var keys = Object.keys(envs);
    keys.forEach(function (key, _idx) {
        process.env[key] = envs[key];
    });
}
function executeScript() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getData().then(function (data) {
                        if (!data)
                            return;
                        if (!data.browser) {
                            console.log('no browser');
                            return;
                        }
                        if (!data.testfile) {
                            console.log('no testfile');
                            return;
                        }
                        setEnvs(__assign({}, data.envs, config.vars));
                        testcafe_1["default"]('localhost', 1337, 1338)
                            .then(function (tc) {
                            var runner = data.liveMode
                                ? tc.createLiveModeRunner()
                                : tc.createRunner();
                            return runner
                                .src(data.testfile)
                                .browsers(data.browser)
                                .run();
                        })
                            .then(function () {
                            if (testcafe)
                                testcafe.close();
                            process.exit(0);
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
executeScript();
