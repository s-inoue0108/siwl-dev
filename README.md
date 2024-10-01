# SIWL.dev

![SIWL.dev](https://siwl-v4.vercel.app/siwl-logo.svg)

[https://siwl-v4.vercel.app](https://siwl-v4.vercel.app)

# コンテンツの編集

# siwl CLI

コンテンツ管理を行うための CLI です。

```bash
$ siwl <action> <model> <filename>
```

## `<model>`

`article` または `tag` を指定します。

## `<action>`

### 共通のもの

以下のコマンドは `<model>` `<filename>` を指定せず実行します。
開発サーバの起動、公開設定の反映などがあります。

| `<action>` | 説明                                                                                   |
| :--------- | :------------------------------------------------------------------------------------- |
| `dev`      | 開発サーバを起動し、localhost にアクセスします。                                       |
| `publish`  | `edit` リモートブランチにすべての変更内容を反映し、`main` ブランチにマージします。[^1] |
| `log`      | 変更履歴を表示します。                                                                 |

[^1]: `git switch edit -> git add . -> git commit -m "edit: message" -> git push origin edit -> git switch main -> git merge edit -> git push origin main -> git switch edit`

### 引数をとるもの

コンテンツの追加・削除・編集などのコマンドがあります。
`<model>` には `article`、`tag`、`bookmark` を選択できます。

| `<action>`                  | 説明                                                                                                |
| :-------------------------- | :-------------------------------------------------------------------------------------------------- |
| `add <model> <filename>`    | `/content/<model>/` に `<filename>.mdx` または `<filename>.yaml` を追加し、スキーマを初期化します。 |
| `remove <model> <filename>` | `/content/<model>/` から `<filename>.mdx` または `<filename>.yaml` を削除します。                   |
| `open <model> <filename>`   | `<filename>.mdx` または `<filename>.yaml` を開きます。                                              |
| `draft <model> <filename>`  | `<filename>.mdx` または `<filename>.yaml` を下書き設定に戻します。                                  |
| `public <model> <filename>` | `<filename>.mdx` または `<filename>.yaml` を公開設定にします。                                      |
| `list <model>`              | `<model>` を一覧表示します。`draft` になっているコンテンツはハイライト表示します。                  |
