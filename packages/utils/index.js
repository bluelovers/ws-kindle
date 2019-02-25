"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_color2_1 = require("debug-color2");
exports.Console = debug_color2_1.Console;
const fs = require("fs");
const nanoid = require("nanoid");
const os = require("os");
const Bluebird = require("bluebird");
exports.Bluebird = Bluebird;
const path = require("path");
function createConsole() {
    return new debug_color2_1.Console();
}
exports.createConsole = createConsole;
function _spawnOptions(options) {
    return {
        encoding: 'buffer',
        ...options,
    };
}
exports._spawnOptions = _spawnOptions;
function tmpdir(baseTmpPath) {
    return path.join(baseTmpPath || os_tmpdir(), random_name());
}
exports.tmpdir = tmpdir;
function os_tmpdir() {
    return fs.realpathSync(os.tmpdir());
}
exports.os_tmpdir = os_tmpdir;
function random_name() {
    return nanoid();
}
exports.random_name = random_name;
exports.default = exports;
//# sourceMappingURL=index.js.map