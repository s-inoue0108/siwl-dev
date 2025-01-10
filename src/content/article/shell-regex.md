---
isDraft: true
isLimited: false
title: シェルで正規表現を使う
category: tech
tags: [shell]
description: シェルの正規表現についてまとめます。
publishDate: 2024-11-18T11:18:10+09:00
updateDate: 2024-11-18T11:18:10+09:00
relatedArticles: []
---

## 参考

https://qiita.com/ko1nksm/items/53abc144558b9bb5629f

## Usage

### find コマンドと合わせる

```bash:マッチするファイルを検索
$ find <dirpath> -name <regex>
```

```bash:マッチするファイルを削除
$ find <dirpath> -name <regex> -exec rm {} \
```