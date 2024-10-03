# SIWL.dev

![SIWL.dev](https://siwl-v4.vercel.app/siwl-logo.svg)

[https://siwl-v4.vercel.app](https://siwl-v4.vercel.app)

# ルート構成

`/utils/route.ts` の `_ROUTE_CONFIG` でページルートとメタ情報を管理しています。以下は例です。

```ts
[
	{
		name: "Home",
		matchers: [/^\/$/],
		rootpath: "/",
		description: "プログラミングについての情報を発信しています。",
		subsets: [...],
	},
];
```

# SIWL Contents CLI

コンテンツ管理を行うための CLI です。`/cli` に実行ファイルがあります。

```bash
$ siwl <action> <filename> <model>
```

## `<model>`

`article` または `tag`、`bookmark` を指定します。

> [!TIP]
> 何も指定していない場合は `article` を参照します。

## `<action>`

### 共通のもの

以下のコマンドは `<model>` `<filename>` を **_指定せず_** 実行します。
開発サーバの起動、公開設定の反映などがあります。

| コマンド | 説明                                                                                                                                            |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `serve`  | 開発サーバを起動し、localhost にアクセスします。                                                                                                |
| `apply`  | `edit` リモートブランチにすべての変更内容を反映し、`main` ブランチにマージします。[^1] 自動でデプロイを実行し、新しいインスタンスを作成します。 |
| `log`    | 変更履歴を表示します。                                                                                                                          |
| `help`   | ヘルプを表示します。                                                                                                                            |

[^1]: `git switch edit -> git add . -> git commit -m "edit: message" -> git push origin edit -> git switch main -> git merge edit -> git push origin main -> git switch edit`

### 引数をとるもの

以下のコマンドは `<model>` や `<filename>` を **_指定して_** 実行します。
コンテンツの追加・削除・編集などのコマンドがあります。

| コマンド                      | 説明                                                                                                                                                          |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `add <filename> <model>`      | `/content/<model>/` に `<filename>.mdx` または `<filename>.yaml` を追加し、スキーマを初期化します。                                                           |
| `remove <filename> <model>`   | `/content/<model>/` から `<filename>.mdx` または `<filename>.yaml` を削除します。                                                                             |
| `open <filename> <model>`     | `<filename>.mdx` または `<filename>.yaml` を Visual Studio code で開きます。                                                                                  |
| `draft <filename> <model> `   | `<filename>.mdx` または `<filename>.yaml` の `isDraft` プロパティを `true` に変更し、下書き設定に戻します。                                                   |
| `publish <filename> <model> ` | `<filename>.mdx` または `<filename>.yaml` の `isDraft` プロパティを `false` に変更し、公開設定にします。`updateDate` プロパティのタイムスタンプを更新します。 |
| `list <model>`                | `<model>` を一覧表示します。下書き設定になっているコンテンツはハイライト表示します。                                                                          |

# 記事のマークアップ

## MDX で使用できる装飾コンポーネント
