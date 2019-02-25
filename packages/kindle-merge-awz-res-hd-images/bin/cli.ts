#!/usr/bin/env node

import yargs = require('yargs');
import { handleFile } from '../index';

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
	.argv
;

handleFile({
	azwFile: argv.azw,
	resFile: argv.res,
})
	.then(function (data)
	{
		delete data.buffer;

		console.dir(data);
	})
;
