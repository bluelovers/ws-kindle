/**
 * Created by user on 2019/2/24.
 */
/// <reference types="node" />
export interface IOptions {
    /**
     * kindlehdunpack.exe
     */
    bin?: string;
    paths?: string[];
    exts?: string[];
    tmp?: string;
    output?: string;
    output_name?: string;
    cwd?: string;
    absolute?: boolean;
    log?: boolean;
}
/**
 * get kindlehdunpack by options
 */
export declare function binpath(options?: IOptions): string;
export declare function cwdpath(options?: IOptions): string;
export declare function tmppath(options?: IOptions): string;
export declare function outputpath(options?: IOptions): string;
export declare function _spawn(file: string, options?: IOptions): import("cross-spawn-extra").SpawnSyncReturns<Buffer>;
export declare function listGlobFile(glob?: string[], options?: IOptions): string[];
export declare function handleGlobFile(glob?: string[], options?: IOptions): {
    /**
     * input file
     */
    file: string;
    /**
     * meta info
     */
    info: {
        /**
         * 書籍名稱
         */
        book_title: string;
    };
    /**
     * output HDimages path
     */
    HDimages: string;
}[];
export declare function handleFiles(files: string[], options?: IOptions): {
    /**
     * input file
     */
    file: string;
    /**
     * meta info
     */
    info: {
        /**
         * 書籍名稱
         */
        book_title: string;
    };
    /**
     * output HDimages path
     */
    HDimages: string;
}[];
export declare function handleFile(file: string, options?: IOptions): {
    /**
     * input file
     */
    file: string;
    /**
     * meta info
     */
    info: {
        /**
         * 書籍名稱
         */
        book_title: string;
    };
    /**
     * output HDimages path
     */
    HDimages: string;
};
export declare function parseLog(log: string | Buffer): {
    /**
     * 書籍名稱
     */
    book_title: string;
};
export declare function handleOptions<T extends IOptions>(options?: T | IOptions): T & IOptions;
declare const _default: typeof import(".");
export default _default;
