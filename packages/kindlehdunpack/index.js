"use strict";
/**
 * Created by user on 2019/2/24.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
const path = require("path");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const fs = require("fs-extra");
const nanoid = require("nanoid");
const os = require("os");
const debug_color2_1 = require("debug-color2");
const moment = require("moment");
const FastGlob = require("fast-glob");
const console = new debug_color2_1.Console();
__dirname = fs.realpathSync(__dirname);
/**
 * get kindlehdunpack by options
 */
function binpath(options = {}) {
    if (options && options.bin) {
        return options.bin;
    }
    else {
        let exts = [
            ...(options && options.exts || []),
            '.exe',
        ];
        let file;
        let bool = [
            cwdpath(options),
            ...(options && options.paths || []),
        ].some(function (dir) {
            return dir != null && [
                dir,
                path.join(dir, 'bin'),
            ]
                .some(function (dir) {
                return exts
                    .some(function (ext) {
                    file = path.join(dir, 'kindlehdunpack' + ext);
                    return ext != null && fs.pathExistsSync(file);
                });
            });
        });
        if (bool) {
            return file;
        }
        return path.join(__dirname, 'bin', 'exe', 'kindlehdunpack.exe');
    }
}
exports.binpath = binpath;
function cwdpath(options = {}) {
    let tmp = fs.realpathSync(options && options.cwd || process.cwd());
    return tmp;
}
exports.cwdpath = cwdpath;
function tmppath(options = {}) {
    let tmp = options && options.tmp;
    if (options && options.tmp === null) {
        tmp = cwdpath(options);
        if (tmp === __dirname) {
            tmp = path.join(__dirname, 'test/temp');
            fs.ensureDirSync(tmp);
        }
    }
    tmp = fs.realpathSync(tmp || os.tmpdir());
    return tmp;
}
exports.tmppath = tmppath;
function outputpath(options = {}) {
    let tmp;
    if (options && options.output) {
        tmp = fs.realpathSync(options.output);
    }
    else {
        let p2 = cwdpath(options);
        let name = options && options.output_name && options.output_name.length && options.output_name || 'HDimages-' + moment().format(`YYYY-MM-DD-hh-mm-ss-SSS`);
        if (__dirname === p2) {
            tmp = path.join(__dirname, 'test/temp', name);
        }
        else {
            tmp = path.join(p2, name);
        }
    }
    return tmp;
}
exports.outputpath = outputpath;
function _spawn(file, options = {}) {
    return cross_spawn_extra_1.sync(options.bin, [
        file,
    ], {
        encoding: 'buffer',
        //stdio: 'inherit',
        cwd: options.tmp,
    });
}
exports._spawn = _spawn;
function listGlobFile(glob, options = {}) {
    //options = handleOptions(options);
    let ls = FastGlob.sync(glob || [
        '*.azw.res',
        '*.azw6',
    ], {
        cwd: cwdpath(options),
        absolute: options && options.absolute,
    });
    return ls;
}
exports.listGlobFile = listGlobFile;
function handleGlobFile(glob, options = {}) {
    options = options || {};
    const output = options && options.output;
    options.log && console.debug(`開始搜尋目標路徑`);
    let files = listGlobFile(glob, options);
    if (files && files.length) {
        options.log && console.gray.info(files);
        let r = handleFiles(files, {
            ...options,
            output,
        });
        options.log && console.debug(`結束`);
        return r;
    }
    else {
        options.log && console.error(`沒有找到任何符合的檔案`);
        options.log && console.error(glob);
    }
}
exports.handleGlobFile = handleGlobFile;
function handleFiles(files, options = {}) {
    const output = options && options.output;
    return files.reduce(function (a, file) {
        let r = handleFile(file, {
            ...options,
            output,
        });
        a.push(r);
        return a;
    }, []);
}
exports.handleFiles = handleFiles;
function handleFile(file, options = {}) {
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
    let log = Buffer.concat(cp.output.filter(v => v));
    let info = parseLog(log);
    options.log && console.gray(log.toString());
    fs.writeFileSync(path.join(_dir, '~kindlehdunpack.log'), log);
    fs.writeFileSync(path.join(_dir, 'info.txt'), `書籍名稱：\n${info.book_title}\n\n${file}\n${options.output}`);
    fs.moveSync(_dir, options.output);
    options.log && console.gray.debug(`刪除暫存資料夾\n${tmpPath}`);
    fs.removeSync(tmpPath);
    options.log && console.success(`書籍名稱：\n${info.book_title}\n\n${file}\n${options.output}`);
    return {
        /**
         * input file
         */
        file,
        /**
         * meta info
         */
        info,
        /**
         * output HDimages path
         */
        HDimages: options.output,
    };
}
exports.handleFile = handleFile;
function parseLog(log) {
    log = log.toString();
    let book_title = (log.match(/^EXTH MetaData\r?\n([^\r\n]+)$/m) || [])[1];
    return {
        /**
         * 書籍名稱
         */
        book_title,
    };
}
exports.parseLog = parseLog;
function handleOptions(options = {}) {
    // @ts-ignore
    options = options || {};
    options.cwd = cwdpath(options);
    options.bin = binpath(options);
    options.tmp = tmppath(options);
    options.output = outputpath(options);
    // @ts-ignore
    return options;
}
exports.handleOptions = handleOptions;
exports.default = exports;
//# sourceMappingURL=index.js.map