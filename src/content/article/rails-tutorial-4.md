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

## 参考

https://zenn.dev/925rycki/articles/00098405e50107

## Devise の導入

```ruby:Gemfile
gem "devise"
gem "devise_token_auth"
gen "devise-i18n"
gen "rack-cors"
```

```bash:Gemの更新
$ bundle install
```

```bash:インストールと初期化
$ rails g devise:install
$ rails g devise_token_auth:install User auth
```