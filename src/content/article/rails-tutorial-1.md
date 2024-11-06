---
isDraft: false
title: Ruby on Rails で API を作る（環境構築編）
category: tech
tags: [rails]
description: 著名な Web バックエンドフレームワークである Ruby on Rails を学び、 API を作ります。初回のこの記事では、ローカル環境に Ruby on Rails の環境を構築します。
publishDate: 2024-11-02T21:48:19+09:00
updateDate: 2024-11-06T22:51:27+09:00
relatedArticles: [rails-tutorial-2]
---

## 筆者の環境

- Windows 11 Home
- Ruby >= 3.1.4
- Ruby on Rails 7.0.0

## Ruby のインストール

https://rubyinstaller.org/downloads/

```bash:バージョン確認
$ ruby -v
```

今回は Ruby + DevKit `v3.1.6` をインストールしました。

## Ruby on Rails の環境構築

### インストール

```bash:インストール
$ gem install rails -v 7
```

```bash:バージョン確認
$ rails -v
```

今回は Ruby on Rails `v7.0.0` をインストールしました。

### 新規プロジェクトの作成

今回は JSON API を作成するため、`--api` オプションをつけてプロジェクトを作成します。

```bash:新規プロジェクトの作成
$ mkdir RailsApp
$ cd RailsApp
# 作成
$ rails new [app-name] --api
```

### サーバ起動

```bash:起動
$ rails s
```

`localhost:3000` にアクセスするとランディングページが表示されます。

### ブランチを切る

```bash:ブランチを切る
$ git switch -c develop
$ git merge main
$ git push -u origin develop
```

## 参考

https://prog-8.com/docs/rails-env-win

https://railsguides.jp/api_app.html

> [!info] Docker を利用する場合
> 
> Docker + WSL2 の動作が不安定でやめましたが、[Docker を利用した環境構築](https://qiita.com/daki/items/99aa2d98eff8103c2a0a) も可能です。