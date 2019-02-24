/**
 * Created by user on 2019/2/24.
 */

import path = require('path');
import { async as crossSpawnAsync, sync as crossSpawnSync } from 'cross-spawn-extra';
import fs = require('fs-extra');
import nanoid = require('nanoid');
import os = require('os');
import { Console } from 'debug-color2';
import moment = require('moment');
import FastGlob = require('fast-glob');

const console = new Console();

__dirname = fs.realpathSync(__dirname);

export interface IOptions
{
	/**
	 * kindlehdunpack.exe
	 */
	bin?: string,
	paths?: string[],
	exts?: string[],

	tmp?: string,

	output?: string,
	output_name?: string,

	cwd?: string,

	absolute?: boolean,

	log?: boolean,
}

/**
 * get kindlehdunpack by options
 */
export function binpath(options: IOptions = {}): string
{
	if (options && options.bin)
	{
		return options.bin
	}
	else
	{
		let exts = [
			...(options && options.exts || []),
			'.exe',
		];

		let file: string;

		let bool = [
			cwdpath(options),
			...(options && options.paths || []),
		].some(function (dir)
		{
			return dir != null && [
				dir,
				path.join(dir, 'bin'),
			]
				.some(function (dir)
				{
					return exts
						.some(function (ext)
						{
							file = path.join(dir, 'kindlehdunpack' + ext);

							return ext != null && fs.pathExistsSync(file)
						})
					;
				})
			;
		});

		if (bool)
		{
			return file;
		}

		return path.join(__dirname, 'bin', 'kindlehdunpack.exe')
	}
}

export function cwdpath(options: IOptions = {})
{
	let tmp = fs.realpathSync(options && options.cwd || process.cwd());

	return tmp;
}

export function tmppath(options: IOptions = {})
{
	let tmp: string = options && options.tmp;

	if (options && options.tmp === null)
	{
		tmp = cwdpath(options);

		if (tmp === __dirname)
		{
			tmp = path.join(__dirname, 'test/temp');
			fs.ensureDirSync(tmp);
		}
	}

	tmp = fs.realpathSync(tmp || os.tmpdir());

	return tmp;
}

export function outputpath(options: IOptions = {})
{
	let tmp: string;

	if (options && options.output)
	{
		tmp = fs.realpathSync(options.output);
	}
	else
	{
		let p2 = cwdpath(options);

		let name = options && options.output_name && options.output_name.length && options.output_name || 'HDimages-' + moment().format(`YYYY-MM-DD-hh-mm-ss-SSS`);

		if (__dirname === p2)
		{
			tmp = path.join(__dirname, 'test/temp', name)
		}
		else
		{
			tmp = path.join(p2, name)
		}
	}

	return tmp;
}

export function _spawn(file: string, options: IOptions = {})
{
	return crossSpawnSync(options.bin, [
		file,
	], {
		encoding: 'buffer',
		//stdio: 'inherit',
		cwd: options.tmp,
	})
}

export function listGlobFile(glob?: string[], options: IOptions = {})
{
	//options = handleOptions(options);

	let ls = FastGlob.sync<string>(glob || [
		'*.azw.res',
		'*.azw6',
	], {
		cwd: cwdpath(options),
		absolute: options && options.absolute,
	});

	return ls;
}

export function handleGlobFile(glob?: string[], options: IOptions = {})
{
	options = options || {};

	const output = options && options.output;

	options.log && console.debug(`開始搜尋目標路徑`);
	let files = listGlobFile(glob, options);

	if (files && files.length)
	{
		options.log && console.gray.info(files);

		handleFiles(files, {
			...options,
			output,
		});

		options.log && console.debug(`結束`);
	}
	else
	{
		options.log && console.error(`沒有找到任何符合的檔案`);
		options.log && console.error(glob);
	}
}

export function handleFiles(files: string[], options: IOptions = {})
{
	const output = options && options.output;

	files.forEach(function (file)
	{
		handleFile(file, {
			...options,
			output,
		})
	});
}

export function handleFile(file: string, options: IOptions = {})
{
	options = handleOptions(options);

	let tmpPath = path.join(options.tmp, nanoid());

	let _file = path.join(tmpPath, '~tmp.azw6');
	let _dir = path.join(tmpPath, 'HDimages');
	let _bin = path.join(tmpPath, 'kindlehdunpack.exe');

	file = fs.realpathSync(file);

	options.log && console.gray.info(`建立暫存資料夾\n${tmpPath}`);
	fs.ensureDirSync(_dir);

	fs.copySync(options.bin, _bin);
	fs.copySync(file, _file);

	options.log && console.debug(`開始處理\n${file}`);
	let cp = _spawn(_file, {
		...options,

		bin: _bin,
		tmp: tmpPath,
	});

	options.log && console.debug(`輸出紀錄：`);
	let log = Buffer.concat(cp.output.filter(v => v) as any);

	let info = parseLog(log);

	options.log && console.gray(log.toString());

	fs.writeFileSync(path.join(_dir, '~kindlehdunpack.log'), log);

	fs.writeFileSync(path.join(_dir, 'info.txt'), `書籍名稱：\n${info.novel_title}\n\n${file}\n${options.output}`);

	fs.moveSync(_dir, options.output);

	options.log && console.gray.debug(`刪除暫存資料夾\n${tmpPath}`);
	fs.removeSync(tmpPath);

	options.log && console.success(`書籍名稱：\n${info.novel_title}\n\n${file}\n${options.output}`);
}

export function parseLog(log: string | Buffer)
{
	log = log.toString();

	let novel_title = (log.match(/^EXTH MetaData\r?\n([^\r\n]+)$/m) || [])[1];

	return {
		novel_title,
	}
}

export function handleOptions<T extends IOptions>(options: T | IOptions = {}): T & IOptions
{
	// @ts-ignore
	options = options || {};

	options.cwd = cwdpath(options);
	options.bin = binpath(options);
	options.tmp = tmppath(options);
	options.output = outputpath(options);

	// @ts-ignore
	return options
}

export default exports as typeof import('./index');
