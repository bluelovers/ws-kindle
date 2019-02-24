#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yarg = require("yargs");
const index_1 = require("../index");
let argv = yarg
    .argv;
let options = {
    log: true,
};
if (argv._.length) {
    index_1.handleGlobFile(argv._, options);
}
else {
    index_1.handleGlobFile(null, options);
}
//# sourceMappingURL=kindlehdunpack.js.map