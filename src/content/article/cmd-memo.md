---
isDraft: true
isLimited: false
title: UNIX コマンドメモ
category: tech
tags: [shell]
description: UNIX コマンドのメモです。
publishDate: 2024-12-05T13:29:36+09:00
updateDate: 2024-12-07T13:52:18+09:00
relatedArticles: []
---

## ファイルとディレクトリを表示する - ls

```bash:ls
$ ls <file?|dirname?>

# -a オプションは隠しファイルも表示する
$ ls -a <file?|dirname?>

# -l オプションはパーミッションも表示する
$ ls -l <file?|dirname?>
```

## 文字列を検索する - grep

```bash:grep
$ grep "<strings>" <file>

# -i オプションは大文字と小文字の区別をなくす
$ grep "<strings>" <file>
```

## ファイルを圧縮する - gzip

```bash:gzip
$ gzip <file>
```

## ファイルを解凍する - gunzip

```bash:gunzip
$ gunzip <file>.gz
```

## ファイルをアーカイブする - tar

### tar.gz ファイル

```bash:tar
# 解凍する
$ tar -zxvf <filename>.tar.gz

# 圧縮する
$ tar -zcvf <filename>.tar.gz
```

### tar ファイル

```bash:tar
# 解凍する
$ tar -xvf <filename>.tar

# 圧縮する
$ tar -cvf <filename>.tar <dirname?>
```