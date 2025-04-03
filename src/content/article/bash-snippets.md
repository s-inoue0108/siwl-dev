---
isDraft: false
isLimited: false
title: Bash コードスニペット集
category: tech
tags: [shell]
description: "Bash の基本的なコードスニペットを集めた備忘録です。"
publishDate: 2025-04-03T20:05:55+09:00
updateDate: 2025-04-03T20:46:13+09:00
relatedArticles: []
---

## リダイレクト

```bash
command > file   # 標準出力を上書きして書き込み
command >> file  # 標準出力を追加書き込み
command 2> file  # 標準エラー出力を上書きして書き込み
command &> file  # 標準出力、エラー出力を同一ファイルに書きこみ
```

## for による繰り返し

`seq` を使ったイテレーション：

```bash
for i in `seq 1 10`; do
  echo $i
done
```

[ブレース展開](https://qiita.com/laikuaut/items/642aa329a8d214a2cccb)を使用したイテレーション：

```bash
for i in {1..10}; do
  echo $i
done
```

## ファイルを読み込む

```bash
#!/bin/bash

if [ ! -f "$1" ]; then
  exit 0
fi

while read line; do
  echo "$line"
done < "$1"
```

## ヒアドキュメント

https://qiita.com/take4s5i/items/e207cee4fb04385a9952

```bash
cat <<EOF
hoge
fuga
EOF
```

ヒアドキュメントを書き込む：

```bash
cat <<EOF > "file.txt"
hoge
fuga
EOF
```

## sed

## awk