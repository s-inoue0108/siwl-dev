---
isDraft: false
isLimited: false
title: tmux でターミナル環境を快適にする
category: tech
tags: [shell]
description: ターミナルの分割やセッション画面を行うためのソフトウェアツールである tmux の使用法と、セットアップについてまとめます。
publishDate: 2025-09-07T23:44:30+09:00
updateDate: 2025-09-07T23:44:30+09:00
relatedArticles: []
---

## インストール

### Linux

- Ubuntu or Debian

```bash
apt install tmux
```

- RHEL or CentOS

```bash
yum install tmux
```

### MacOS

- HomeBrew

```bash
brew install tmux
```

- Macports

```bash
port install tmux
```

## 操作

### セッションの起動

```bash
tmux
```

### プレフィックスキー

tmux では、**プレフィックスキー**という特定のキーを押下してからコマンドを叩くことが多いです。プレフィックスキーはデフォルトで `Ctrl + b` です。

### ウインドウ操作

tmux では、1枚のターミナルで複数のウインドウを扱うことができます。

```bash
prefix + c   # 新しいウインドウを起動
prefix + n   # 次のウインドウへ移動
prefix + p   # 前のウインドウへ移動
prefix + x   # ウインドウを破棄 (exit でもよい)
```

### ペイン操作

ペインはウインドウの分割窓のことを指します。

```bash
prefix + "       # 上下にペイン分割
prefix + %       # 左右にペイン分割
prefix + Arrow   # ペインを移動
prefix + x       # ペインを破棄 (exit でもよい)
```

## 設定を変更する

tmux では、`.tmux.conf` をホームディレクトリに配置することでユーザー固有の設定を保持することができます。
\
以下は MacOS を用いる場合の設定です。

```bash:.tmux.conf
# ターミナルカラーのセットアップ
set -g default-terminal "tmux-256color"
set -as terminal-overrides ",xterm-256colors:RGB"

# マウスを使えるようにする
set -g mouse on

# ペインの番号設定
set -g base-index 1
set -g pane-base-index 1 
set -g renumber-windows on

# ペインのスタイル
set -g pane-border-lines heavy
set -g pane-border-style fg="#141830"
set -g pane-active-border-style fg="#7852dc"

# ステータスの設定
set -g status-style bg=default,fg="#7852dc"
set -g status-left ""
set -g status-right ""
set -g status-justify right

# プレフィックスキーを Ctrl + w にする
set -g prefix C-w
unbind C-b

# Shift + Arrow でウインドウをスワップできるようにする
bind -n S-left previous-window
bind -n S-right next-window

# prefix + \ or - でペインを分割できるようにする
unbind '"'
unbind %
bind \\ split-window -h
bind - split-window -v

# ドラッグした文字をクリップボードにコピーする
bind-key -T copy-mode-vi MouseDragEnd1Pane send-keys -X copy-pipe-and-cancel "pbcopy"
```

## 参考

以下の記事などを参考にしています[^1]。

[^1]: 奥が深い...

https://www.tohoho-web.com/ex/tmux.html

https://qiita.com/nmrmsys/items/03f97f5eabec18a3a18b

https://qiita.com/koin3z/items/5d923b1cd7a3ce6ca32b
