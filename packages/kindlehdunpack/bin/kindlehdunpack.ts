#!/usr/bin/env node

import yarg = require('yargs');
import { handleFiles, handleGlobFile, IOptions } from '../index';

let argv = yarg
	.argv
;

let options: IOptions = {
	log: true,
};

if (argv._.length)
{
	handleGlobFile(argv._, options)
}
else
{
	handleGlobFile(null, options)
}
