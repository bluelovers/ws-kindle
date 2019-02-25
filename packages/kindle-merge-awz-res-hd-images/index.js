"use strict";
/**
 * Created by user on 2019/2/26.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const fs = require("fs-extra");
const FastGlob = require("fast-glob");
const kindlehdunpack = require("kindlehdunpack");
const naturalCompare = require("string-natural-compare");
const JSZip = require("jszip");
const utils_1 = require("@node-kindle/utils");
function handleFile({ azwFile, resFile, }, outPath) {
    try {
        azwFile = fs.realpathSync(azwFile);
    }
    catch (e) {
        throw new Error(`檔案不存在 ${azwFile}`);
    }
    try {
        resFile = fs.realpathSync(resFile);
    }
    catch (e) {
        throw new Error(`檔案不存在 ${resFile}`);
    }
    outPath = outPath || process.cwd();
    let tmpPath = utils_1.tmpdir();
    tmpPath = path.join(__dirname, 'test', 'temp');
    let azwFileTmp = path.join(tmpPath, 'tmp.azw');
    let resFileTmp = path.join(tmpPath, 'tmp.res');
    fs.ensureDirSync(tmpPath);
    fs.copyFileSync(azwFile, azwFileTmp);
    fs.copyFileSync(resFile, resFileTmp);
    cross_spawn_extra_1.sync(path.join(__dirname, 'bin-exe', 'kindleunpack.exe'), [
        azwFileTmp,
    ], utils_1._spawnOptions({
        cwd: tmpPath,
    }));
    let path_imgs_hd = path.join(tmpPath, 'imgs_hd');
    fs.ensureDirSync(path_imgs_hd);
    kindlehdunpack.handleFile(resFileTmp, {
        output: path_imgs_hd,
    });
    let imgs_epub = list_imgs_epub(tmpPath);
    let imgs_hd = list_imgs(path_imgs_hd);
    if (!imgs_epub.length) {
        throw new Error(`azw 中不存在圖片 或者 提取失敗`);
    }
    if (!imgs_hd.length) {
        throw new Error(`res 中不存在圖片 或者 提取失敗`);
    }
    let list_match = match_images(imgs_hd, imgs_epub);
    list_match.forEach(function (data) {
        if (data.epub) {
            fs.copyFileSync(data.hd, data.epub);
        }
        {
            console.warn(`找不到配對的圖片 ${path.basename(data.hd)}`);
        }
    });
    return lazy_epub(tmpPath, list_match)
        .then(async function (data) {
        let new_epub = path.join(outPath, path.basename(azwFile)) + '.hd.epub';
        let new_mobi = path.join(outPath, path.basename(azwFile)) + '.hd.mobi';
        await fs.writeFile(new_epub, data.buffer);
        await cross_spawn_extra_1.async(path.join(__dirname, 'bin-exe', 'kindlegen.exe'), [
            new_epub,
        ], utils_1._spawnOptions({
            cwd: path.dirname(new_epub),
        }));
        await fs.remove(tmpPath);
        return {
            azwFile,
            resFile,
            new_epub,
            new_mobi,
            buffer: data.buffer,
        };
    });
}
exports.handleFile = handleFile;
async function lazy_epub(tmpPath, list_match) {
    let epub_root = path.join(tmpPath, 'tmp', 'mobi8');
    let zip_buf = await fs.readFile(path.join(epub_root, 'tmp.epub'));
    let zip = await JSZip
        .loadAsync(zip_buf);
    await utils_1.Bluebird.map(list_match, async function (data) {
        if (data.epub) {
            let key = data.epub.replace(/^.+(?=OEBPS\/)/, '');
            let buf = await fs.readFile(data.hd);
            await zip.file(key, buf, {
                binary: true,
            });
        }
    });
    let new_zip_buf = await zip.generateAsync({
        type: 'nodebuffer',
    });
    let file = path.join(tmpPath, 'tmp.new.epub');
    await fs.writeFile(file, new_zip_buf);
    return {
        file,
        buffer: new_zip_buf,
    };
}
exports.lazy_epub = lazy_epub;
function match_images(imgs_hd, imgs_epub) {
    return imgs_hd
        .reduce(function (a, file) {
        let idkey = (file.match(/(\d+)\.jpeg$/) || [])[1];
        let i;
        if (idkey && (i = parseInt(idkey)) && i > 0) {
            i--;
            a.push({
                index: i,
                hd: file,
                epub: imgs_epub[i],
            });
        }
        else {
            a.push({
                hd: file,
                epub: null,
            });
        }
        return a;
    }, []);
}
exports.match_images = match_images;
function list_imgs(tmpPath) {
    let imgs_epub = FastGlob.sync([
        '*.jpeg',
        'cover*.jpeg',
        '!*.jpeg.hd.jpeg',
    ], {
        cwd: tmpPath,
        absolute: true,
    });
    imgs_epub.sort();
    return imgs_epub;
}
exports.list_imgs = list_imgs;
function list_imgs_epub(tmpPath, mode) {
    let r = /^(cover)/;
    return list_imgs(path.join(tmpPath, 'tmp', 'mobi8', 'OEBPS', 'Images'))
        .sort(function (a, b) {
        a = path.basename(a);
        b = path.basename(b);
        if (1) {
            let aa = a.replace(/^\D+/, '');
            let bb = b.replace(/^\D+/, '');
            if (aa.length == bb.length && /^\d+/.test(aa)) {
                return naturalCompare(aa, bb);
            }
        }
        let aa = r.test(a);
        let bb = r.test(b);
        if (aa && !bb) {
            return 1;
        }
        else if (!aa && bb) {
            return -1;
        }
        return 0;
    });
}
exports.list_imgs_epub = list_imgs_epub;
exports.default = exports;
//# sourceMappingURL=index.js.map