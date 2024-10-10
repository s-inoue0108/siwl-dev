// pnpm -s dlx tsx publish.ts <FILE_NAME> <MODEL>

import fs from "fs";

const isModel = (arg: string | undefined): arg is "article" | "tag" | "work" | "bookmark" => {
  return arg === "article" || arg === "tag" || arg === "work" || arg === "bookmark" ? true : false;
}

const filename = process.argv[2].toLowerCase();
const model = isModel(process.argv[3]) ? process.argv[3] : "article";

if (model === "article") {
  // ファイル
  const file = `../../src/content/article/${filename}.md`;
  // 書き込み始める先頭からのバイト数
  const POSITION = 13;

  fs.open(file, "r+", (err, fd) => {
    if (err) throw err;

    fs.write(fd, "false\n", POSITION, (err, written, string) => {
      if (err) throw err;

      console.log(`正常に書き込みが完了しました (${written}bytes)`);

      fs.close(fd, (err) => {
        if (err) throw err;
      });
    });
  })
}
