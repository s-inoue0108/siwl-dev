---
isDraft: true
isLimited: false
title: シェルスクリプトで楽曲ファイルを管理する
category: tech
tags: [shell, dj]
description: "たまに DJ コントローラをポチポチするのですが、いつも頭を悩ませるのが楽曲ファイルの管理です。そこで、シェルスクリプトを利用して楽曲ファイルの管理を容易にするツールを実装します。"
publishDate: 2025-04-12T16:14:53+09:00
updateDate: 2025-04-13T09:33:48+09:00
relatedArticles: []
---

## 楽曲ファイル形式のメタデータ

### WAV

@{wiki}(WAV)

WAV は非圧縮フォーマットであり、（一応）メタデータに対応しているようです。ただし、標準化されたメタデータ形式はなく、ソフトウェア間での互換性にも乏しそうです。

### MP3

@{wiki}(MP3)

MP3 は非可逆圧縮フォーマットであり、ID3 という規格のメタデータが使えます。ID3v1 規格はファイルの末尾に、ID3v2規格は先頭にメタデータを付加します。メタデータはソフトウェアで編集が可能ですが、頑張れば直接バイナリを編集することはできそうです。実際に ID3 タグをバイナリとして読みだしている記事なんかもあります。

https://zenn.dev/kjumanenobikto/articles/368a3b08269f8c

### FLAC

@{wiki}(FLAC)

FLAC は可逆圧縮フォーマットであり、Vorbis Comment という規格のメタデータに対応しています。
\
FLAC においてメタデータを扱う際には、とりわけ **metaflac** というツールが便利かと思います。

https://xiph.org/flac/documentation_tools_metaflac.html

metaflac は、FLAC ファイル中のメタデータの読み取り/書き込みができる公式の CLI です。例えば、FLAC ファイルに埋め込まれているアーティスト名を参照したい場合は、

```bash:コンソール
metaflac --show-tag=ARTIST *.flac
```

のようにすればよいです。詳しい説明は上のページや `metaflac --help` にあります。

### どの形式を使うか

まず、非圧縮である WAV は管理コストが大きいため今回は使用しません。広く用いられている形式は MP3 かと思いますが、圧縮形式にもかかわらず音質の劣化がないうえ、便利な CLI ツールが付属している FLAC 形式を対象に実装したいと思います。

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