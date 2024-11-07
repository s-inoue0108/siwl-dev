---
isDraft: false
title: Ruby on Rails で API を作る（モデル編）
category: tech
tags: [rails]
description: 著名な Web バックエンドフレームワークである Ruby on Rails を学び、 API を作ります。第2回のこの記事では、Rails でモデルを作成し、マイグレーションを実行します。 
publishDate: 2024-11-06T22:51:37+09:00
updateDate: 2024-11-07T22:27:22+09:00
relatedArticles: []
---

## モデルの作成

`model` はデータベースのテーブルに対応します。今回は試薬を管理する `Reagents` テーブルを `rails g model` コマンドで作成します。

```bash:モデルの作成
$ rails g model Reagent name:string chem_formula:string amount:float amount_unit:string
```

*[!table] カラムの型*

| `type`      | 説明           |
| :---------- | :------------- |
| `string`    | 文字列         |
| `text`      | 長い文字列     |
| `integer`   | 整数           |
| `float`     | 浮動小数       |
| `decimal`   | 高精度浮動小数 |
| `timestamp` | タイムスタンプ |
| `time`      | 時刻           |
| `date`      | 日付           |
| `binary`    | バイナリ       |
| `boolean`   | 真偽値         |

\
`/db/migrate/` に以下のマイグレーションファイルが作成されます。

```ruby:timestamp_create_reagents.rb
class CreateReagents < ActiveRecord::Migration[7.0]
  def change
    create_table :reagents do |t|
      t.string :name
      t.string :chem_formula
      t.float :amount
      t.string :amount_unit

      t.timestamps
    end
  end
end
```

マイグレーションを実行します。

```bash:マイグレーション
$ rails db:migrate
```

## マイグレーションの作成

手動でマイグレーションを作成するには `rails g migration` コマンドを実行します。今回は `Reagents` テーブルに `maker` カラムを追加するマイグレーションを作成します。

```bash:マイグレーションの作成
$ rails g migration AddMakerToReagents maker:string
```

`/db/migrate/` に以下のマイグレーションファイルが作成されます。

```ruby:timestamp_add_maker_to_reagents.rb
class AddMakerToReagents < ActiveRecord::Migration[7.0]
  def change
    add_column :reagents, :maker, :string
  end
end
```

マイグレーションを実行します。

```bash:マイグレーション
$ rails db:migrate
```

## PostgreSQL を使う

以下の記事が参考になりました：

https://qiita.com/Rairu_blog/items/d51795b350a2d1845308

## 参考

https://railsguides.jp/v7.0/active_record_migrations.html