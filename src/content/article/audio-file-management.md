---
isDraft: false
isLimited: true
title: シェルスクリプトでオーディオファイルを管理する
category: tech
tags: [shell, dj]
description: "DJ プレイに使う楽曲ファイルをシェルスクリプトで TSV に書き出したり、メタデータを抽出して容易に管理するための仕組みを作成します。"
publishDate: 2025-04-12T16:14:53+09:00
updateDate: 2025-04-12T17:41:41+09:00
relatedArticles: []
---

たまに DJ コントローラをポチポチするのですが、快適な DJ プレイを行うにあたっていつも頭を悩ませるのが**楽曲ファイルの管理**です。

## FLAC 形式による管理

@{wiki}(FLAC)

オーディオファイル形式のひとつである FLAC (Free Lossless Audio Codec) は、可逆圧縮フォーマットであり、メタデータに対応しています。

### metaflac

https://xiph.org/flac/documentation_tools_metaflac.html

**metaflac** は、FLAC ファイルに埋め込まれた楽曲メタデータの読み取り/書き込みができるコマンドラインツールです。例えば、FLAC ファイルに埋め込まれているアーティスト名を参照したい場合は、

```bash:コンソール
metaflac --show-tag=ARTIST *.flac
```

のようにすればよいです。オプション引数に渡せるフィールド名は上のページや `metaflac --help` に説明があります。


## ファイルのリネーム

DJ で使う楽曲のファイルを [Bandcamp](https://bandcamp.com) から調達してくることがあるのですが、困ったことにファイル名にスペースが含まれていたり、わかりにくかったりします。そこで、FLAC ファイルに埋め込まれているメタデータの `(アーティスト名, タイトル)` の情報をもとに、FLAC ファイルをリネームする Bash スクリプトを作ってみます。

```bash
#!/bin/bash

# tag のフィールド名を取り出してサニタイズ
function tag_processor() {
  flac=$1
  name=$2

  tag=$(metaflac --show-tag="${name}" "${flac}")

  # 先頭の NAME= を削除
  tag=${tag#$name=}

  # Lower case にする
  tag=${tag,,}

  # 半角スペースを _ に置換
  tag=${tag// /_}

  # もし _ が2つ以上続くなら、_ を 1 つにする
  tag=${tag//_+/_}

  # & を and に置換
  tag=${tag//&/and}

  echo ${tag}
}

for flac in *.flac; do
  tag_processor "$flac" "ARTIST"
  tag_processor "$flac" "ALBUM"
done
```