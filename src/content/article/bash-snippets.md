---
isDraft: false
isLimited: false
title: Bash コードスニペット集
category: tech
tags: [shell]
description: "Bash の基本的なコードスニペットを集めた備忘録です。"
publishDate: 2025-04-03T20:05:55+09:00
updateDate: 2025-04-06T11:22:29+09:00
relatedArticles: []
---

## .bashrc の設定

ターミナルセッションの設定と、便利なエイリアス各種を設定します。以下の例では `ls` に手を加えています。

```bash:~/.bashrc
if [ $UID -eq 0 ]; then
  PS1="\[\033[31m\]\u@\h\[\033[00m\]:\w\n\$ "
else
  PS1="\[\033[34m\]\u@\h\[\033[00m\]:\[\033[36m\]\w\[\033[00m\]\\n\$ "
fi

export LSCOLORS=cxfxexdxbxegedabagacad
alias ls="ls -FG --color=auto"
alias ll="ls -lh"
alias tree="tree -C"
alias back="cd $OLDPWD"
alias py="python3"
```

## リダイレクト

```bash
command > file   # 標準出力を上書きして書き込み
command >> file  # 標準出力を追加書き込み
command 2> file  # 標準エラー出力を上書きして書き込み
command &> file  # 標準出力、エラー出力を同一ファイルに書きこみ
```

## for による繰り返し

ファイル名のループ：

```bash
for file in *.txt; do
  echo "$file"
done
```

`seq` を使った連番生成：

```bash
for i in `seq 1 10`; do
  echo $i
done
```

[ブレース展開](https://qiita.com/laikuaut/items/642aa329a8d214a2cccb)を使用した連番生成：

```bash
for i in {1..10}; do
  echo $i
done
```

## ファイルを読み込む

```bash
while read line; do
  echo "$line"
done < "file.txt"
```

## ヒアドキュメント

https://qiita.com/take4s5i/items/e207cee4fb04385a9952

```bash
cat << EOF
hoge
fuga
EOF
```

ヒアドキュメントをファイルに書き込む：

```bash
cat << EOF > "file.txt"
hoge
fuga
EOF
```

## sed

ファイルの中身を表示：

```bash
# 1,3行目を標準出力
sed -n 1,3p file.txt
```

ファイルの中身を正規表現で置換：

```bash
# hoge を fuga にすべて置換して標準出力
sed "s/hoge/fuga/" file.txt

# 置換した内容を上書き
sed -i "s/hoge/fuga/" file.txt

# 3行目のみ置換
sed -e "3 s/hoge/fuga/g" file.txt
```

## awk

やる気出たら書きます...