---
isDraft: true
isLimited: false
title: シェルスクリプトからシェルスクリプトを生成する
category: tech
tags: [shell]
description: シェルスクリプトのヒアドキュメントを使うと、コマンドによるファイル生成を手軽に実行できます。
publishDate: 2024-10-24T22:15:34+09:00
updateDate: 2024-10-24T22:39:51+09:00
relatedArticles: []
---

## 参考

https://qiita.com/osw_nuco/items/a5d7173c1e443030875f#10-4-%E3%83%92%E3%82%A2%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86

## 例

```sh:greeting.sh
#!/bin/sh

SCRIPT="$1.sh"

cat <<EOL >$SCRIPT
#!/bin/sh
echo "Hello, $1."
EOL
```

`greeting.sh` は引数をファイル名とし、`Hello, <引数>.` とした出力をもつシェルスクリプトを吐き出します。

```bash:実行例
# output world.sh
$ . ./greeting.sh world

$ . ./world.sh
# > Hello, world.
```

他にも、ChatGPT に訊くと簡単な例をサクッと提示してくれます。ヒアドキュメント内でコマンド置換もうまく使えるようなので、コマンドの内容を引数でカスタマイズするよりダイナミックに扱いたい場合に便利な手法だと思います。