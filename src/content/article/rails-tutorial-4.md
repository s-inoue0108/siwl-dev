---
isDraft: true
title: Ruby on Rails で API を作る（認証機能編）
category: tech
tags: [rails]
description: 著名な Web バックエンドフレームワークである Ruby on Rails を学び、 API を作ります。第4回のこの記事では、Devise を使用した認証機能を実装します。 
publishDate: 2024-11-07T21:37:30+09:00
updateDate: 2024-11-07T21:37:30+09:00
relatedArticles: []
---

## Devise の導入

```ruby:Gemfile
gem "devise"
```

```bash:Gemの更新
$ bundle install
```

```bash:インストール
$ rails g devise:install
```

```bash:Userモデルの作成
$ rails g devise User
```