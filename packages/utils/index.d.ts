/// <reference types="node" />
import { SpawnSyncOptions } from 'cross-spawn-extra/type';
import { Console } from 'debug-color2';
import Bluebird = require('bluebird');
export { Console, Bluebird };
export declare function createConsole(): Console;
export declare function _spawnOptions(options: SpawnSyncOptions): {
    cwd?: string;
    input?: string | Buffer;
    stdio?: any;
    env?: any;
    uid?: number;
    gid?: number;
    timeout?: number;
    killSignal?: string;
    maxBuffer?: number;
    encoding: string;
    shell?: string | boolean;
    windowsHide?: boolean;
    windowsVerbatimArguments?: boolean;
    stripAnsi?: boolean;
};
export declare function tmpdir(baseTmpPath?: string): string;
export declare function os_tmpdir(): string;
export declare function random_name(): string;
declare const _default: typeof import(".");
export default _default;
