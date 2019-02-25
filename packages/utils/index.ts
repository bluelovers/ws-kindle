
import { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra/type';
import { Console } from 'debug-color2';
import fs = require('fs');
import nanoid = require('nanoid');
import os = require('os');
import Bluebird = require('bluebird');
import path = require('path');

export { Console, Bluebird }

export function createConsole()
{
	return new Console();
}

export function _spawnOptions(options: SpawnSyncOptions)
{
	return {
		encoding: 'buffer',
		...options,
	}
}

export function tmpdir(baseTmpPath?: string)
{
	return path.join(baseTmpPath || os_tmpdir(), random_name());
}

export function os_tmpdir()
{
	return fs.realpathSync(os.tmpdir());
}

export function random_name(): string
{
	return nanoid();
}

export default exports as typeof import('./index');
