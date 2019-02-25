# ws-kindle README

    提取 azw 並且替換為 azw.res 內的圖片後重新打包成新的電子書

## windows

結束後會產生 .hd.mobi 與 .hd.epub 兩個檔案

暫時不支援生成 .azw

```
npx @node-kindle/merge-awz-res-hd-images -a "Shi Jie noAn toZhan uMi Mi Jie - Hei Liu hagane.azw3" -r "CR!DY2AB2Z1MD49S10C4FYCN3DXRTBB.azw.res"
```
