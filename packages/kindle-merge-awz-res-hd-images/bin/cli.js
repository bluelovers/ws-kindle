#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const index_1 = require("../index");
let argv = yargs
    .option('azw', {
    alias: ['a'],
    type: 'string',
    normalize: true,
})
    .option('res', {
    alias: ['r'],
    type: 'string',
    normalize: true,
})
    .argv;
index_1.handleFile({
    azwFile: argv.azw,
    resFile: argv.res,
})
    .then(function (data) {
    delete data.buffer;
    console.dir(data);
});
//# sourceMappingURL=cli.js.map