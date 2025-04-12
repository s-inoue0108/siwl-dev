---
isDraft: false
isLimited: true
title: シェルスクリプトでオーディオファイルを管理する
category: tech
tags: [shell, dj]
description: "DJ プレイに使う楽曲ファイルをシェルスクリプトで TSV に書き出したり、メタデータを抽出して容易に管理するための仕組みを作成します。"
publishDate: 2025-04-12T16:14:53+09:00
updateDate: 2025-04-12T19:07:02+09:00
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

## メタデータを読み込む

### ファイルをリネームする

DJ で使う楽曲のファイルを [Bandcamp](https://bandcamp.com) から調達してくることがあるのですが、困ったことにファイル名にスペースが含まれていたり、わかりにくかったりします。そこで、FLAC ファイルに埋め込まれているメタデータの情報をもとに、FLAC ファイルをリネームする Bash スクリプトを作ってみます。

```bash:rename.sh
#!/bin/bash

function tag_processor() {
  flac=$1
  name=$2

  tag=$(metaflac --show-tag="${name}" "${flac}")

  # 先頭の ARTIST= などを削除
  tag=${tag#$name=}

  # Lower case にする
  tag=${tag,,}

  # 特殊文字を _ に置換
  tag=${tag// /_}
  tag=${tag//,/_}
  tag=${tag//\\t/_}
  tag=${tag//./_}
  tag=${tag//;/_}
  tag=${tag//(/_}
  tag=${tag//)/_}
  tag=${tag//\//_}
  tag=${tag//\\/_}
  tag=${tag//\@/_}
  tag=${tag//|/_}

  # & を and に置換
  tag=${tag//&/and}

  # もし _ が2つ以上続くなら、_ を1つにする
  tag=$(echo "${tag}" | sed -E "s/_{2,}/_/g")

  # ファイル名の最初や最後に _ がある場合、それを削除
  tag=${tag#_}
  tag=${tag%_}

  echo ${tag}
}

for flac in *.flac; do
  artist=$(tag_processor "$flac" "ARTIST")
  title=$(tag_processor "$flac" "TITLE")

  fname="$artist-$title".flac
  mv "$flac" "$fname"

  echo "Renamed $flac to $fname"
done
```

よくある楽曲のタイトル表示らしい `アーティスト名-タイトル` の形式かつ、`snake_case` になるようにリネームすることができます。

### カバーアートを取り出す

### プレイリストの内容を CSV にまとめる

## メタデータを新たに書き込む