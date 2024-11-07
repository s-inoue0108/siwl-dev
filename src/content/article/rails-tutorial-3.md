---
isDraft: true
title: Ruby on Rails で API を作る（コントローラ編）
category: tech
tags: [rails]
description: 著名な Web バックエンドフレームワークである Ruby on Rails を学び、 API を作ります。第3回のこの記事では、Rails でコントローラを作成し、ルーティングを実装します。 
publishDate: 2024-11-07T12:22:19+09:00
updateDate: 2024-11-07T12:22:19+09:00
relatedArticles: []
---

## コントローラの作成

```bash:コントローラの作成
$ rails g controller Reagents
```

これで `/app/controllers` にコントローラのひな型ができますが、今回は API エンドポイントを `/api/v1/` におくため、`/app/controllers/api/v1/` に配置しなおします。
\
内容は以下のようにします。

```ruby:/api/v1/reagents_controller.rb
module Api
  module V1
    class ReagentsController < ApplicationController
      def index
        @reagents = Reagent.all
        render json: @reagents
      end
    end
  end
end
```

`index` メソッドは `Reagents` テーブルのすべてのレコードを JSON 形式で返却します。

### CRUD 処理の実装

## ルーティング

`resources` を宣言することで CRUD に対応する HTTP メソッドをまとめて定義します。

```ruby:config/routes.rb
Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api do
    namespace :v1 do
      resources :users
      resources :reagents
    end
  end
end
```

```bash:確認
$ rails routes
```

## ダミーデータの作成

`config/seeds.rb` に以下を記述します。

```ruby:/config/seeds.rb
3.times do |i|
  Reagent.create(
    name: "Chemical #{i}", 
    chem_formula: "Formula #{i}", 
    amount: 1.5,
    amount_unit: "g",
    maker: "test",
  )
end
```

```bash:ダミーデータを生成
$ rails db:seeds
```

`localhost:3000/api/v1/reagents` にアクセスするか、`$ curl localhost:3000/api/v1/reagents` を実行して動作を確認できます。

## ビジネスロジックをどこに実装するか