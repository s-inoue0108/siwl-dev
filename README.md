# SIWL.dev

![SIWL.dev](https://siwl.dev/siwl-logo.svg)

- [https://siwl.dev](https://siwl.dev)
- [Cloudflare Dashboard](https://dash.cloudflare.com/36267a6e8ba52f5b9b2f32b9ffd99e7b)

## 記事の書き方

### 新しく記事を書く

1. 記事を追加します：

```bash
$ siwl -f <filename> add
```

2. 開発サーバを起動します：

```bash
$ siwl -d
# or
pnpm run dev
```

3. `src/content/article/<filename>.md` のスキーマと内容を編集します。

```bash
# current: src/content
$ code article/<filename>.md
```

4. 記事を公開設定にします：

```bash
$ siwl -f <filename> pub
```

5. 変更を反映します：

```bash
$ siwl -b <branch>
# or
$ git switch <branch>
$ git add .
$ git commit -m "edit article"
$ git push origin <branch>
$ git switch main
$ git merge <branch>
$ git push origin main
$ git switch <branch>
```

### 既存の記事を更新する

1. 記事の公開状態を更新します：

```bash
# 下書きにする
$ siwl -f <filename> dft
# 公開する
$ siwl -f <filename> pub
```

3. 開発サーバを起動します：

```bash
$ siwl -d
# or
pnpm run dev
```

4. 記事の内容を更新します：

```bash
# current: src/content
$ code article/<filename>.md
```

5. 変更を反映します：

```bash
$ siwl -b <branch>
# or
$ git switch <branch>
$ git add .
$ git commit -m "edit article"
$ git push origin <branch>
$ git switch main
$ git merge <branch>
$ git push origin main
$ git switch <branch>
```

## ルーティング

### ページルート

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

## CLI

### Content Management CLI

Node.js/TypeScript/CommanderJS で作成しており、`/.cli/siwl.ts` が実行ファイルです。

```bash
# using pnpm
$ pnpm run siwl <action> -opt
```

以上は NPM スクリプト `tsx /.cli/siwl.ts` を実行します。

#### 利用可能な `<model>`

| `<model>`  | description                  | filetype |
| :--------- | :--------------------------- | :------- |
| `article`  | ブログの記事                 | MARKDOWN |
| `tag`      | ブログのタグ                 | YAML     |
| `bookmark` | Webページのブックマーク      | YAML     |
| `work`     | ポートフォリオページの制作物 | YAML     |

> [!IMPORTANT]
> `<model>` が未指定あるいは typo の場合は `article` モデルを参照します。

#### 利用可能な `<action>`

| `<action>`     | `-opt`                     | description                                                                                                |
| :------------- | :------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `add\|new`     | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を作成し、スキーマを初期化します。                             |
| `remove\|rm`   | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を削除します。                                                 |
| `draft\|dft`   | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を下書きにもどします。                                         |
| `publish\|pub` | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を公開設定にし、`article` の場合はタイムスタンプを更新します。 |
| `list\|ls`     | `-m <model>`               | `src/content/<model>/` を公開状態を含めて一覧表示します。                                                  |
|                | `-h`                       | Content Management CLI のヘルプを表示します。                                                              |
|                | `-v`                       | Content Management CLI のバージョンを表示します。                                                          |

> [!TIP]
> `<action> -h` でコマンド毎のヘルプを表示します。

### Content Management CLI + 汎用オプション

`/.cli/siwl.ts` をフォークした `/.cli/siwl.sh` を実行します。

```bash
$ siwl -opt <action>
```

> [!IMPORTANT]
> 以上のコマンドを実行するためには、次のエイリアスを `~/.bashrc` に設定する必要があります。
> 
> ```bash
> alias siwl="source <local-dir>/.cli/siwl.sh"
> ```

このエイリアスは Content Management CLI のほかに、以下の汎用オプションを提供します。

| `-opt`                       | description                                                                              |
| :--------------------------- | :--------------------------------------------------------------------------------------- |
| `-d`                         | 開発サーバを起動します。                                                                 |
| `-b <branch>`                | `origin/<branch>`へ変更を push し、`origin/main` へマージします。                        |
| `-s`                         | 現在のローカルブランチの内容を `origin/main` の内容で同期します。                        |
| `-e <service> -f <filename>` | Markdown を `<service>` の形式へ変換し、エクスポートします。                             |
| `-t`                         | e2e テストを実行します。                                                                 |
| `-h`                         | プロジェクトに関連する Web ページの情報と、Content Management CLI のヘルプを表示します。 |

## Markdown の構文

GitHub-Flavored Markdown をベースに、拡張構文を導入しています。

> [!TIP]
> 詳細は https://siwl.dev/articles/markdown-syntax-guide にあります。

## Zenn への投稿

`$ siwl -e zenn -f <filename>` を実行すると、[Zenn](https://zenn.dev) のリポジトリへ Markdown を輸送することができます。