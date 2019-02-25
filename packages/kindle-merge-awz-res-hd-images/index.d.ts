/**
 * Created by user on 2019/2/26.
 */
/// <reference types="node" />
export declare function handleFile({ azwFile, resFile, }: {
    azwFile: string;
    resFile: string;
}, outPath?: string): Promise<{
    azwFile: string;
    resFile: string;
    new_epub: string;
    new_mobi: string;
    buffer: Buffer;
}>;
export declare function lazy_epub(tmpPath: string, list_match: ReturnType<typeof match_images>): Promise<{
    file: string;
    buffer: Buffer;
}>;
export declare function match_images(imgs_hd: string[], imgs_epub: string[]): {
    index?: number;
    hd: string;
    epub: string;
}[];
export declare function list_imgs(tmpPath: string): string[];
export declare function list_imgs_epub(tmpPath: string, mode?: boolean): string[];
declare const _default: typeof import(".");
export default _default;
