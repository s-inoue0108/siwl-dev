---
published: true
title: 個人ブログの記事を Zenn, Qiita へエクスポートするコマンドを作る
type: tech
topics: [astro, ts, js, git]
emoji: 🥂
---

## Git Subtree

Git には複数のリポジトリを統合する手段の1つとして **Subtree** というものがあるようです。文字通り、リポジトリをサブディレクトリとして取り込み、別でバージョン管理できるようにする仕組みです。
\
やり方は[この記事](https://qiita.com/takahashi-kazuki/items/0c34b3bc5da6700d38a5)などに書いてあります。

### Zenn のリポジトリを取り込む

例として、Zenn の記事を管理しているリポジトリを取り込んでみます。リポジトリが GitHub にあるとすると、

```bash
git remote add my-zenn-repo https://github.com/username/zenn-repo.git
```

のようにすることで、`my-zenn-repo` という名称でリモートリポジトリを登録することができます。これを現在のプロジェクトのサブディレクトリに取り込みましょう：

```bash
git subtree add --prefix=zenn --squash my-zenn-repo main
```

現在のプロジェクトに `zenn/` というサブディレクトリができ、ここにリポジトリのコンテンツが含まれていることがわかります。
あとはいつものように commit して push すると、現在のプロジェクトのリモートリポジトリにサブツリーの内容が反映されます。

```bash
git commit -m "added subtree"
git push origin main
```

取り込んだリポジトリのリモート `@username/zenn-repo` と変更を同期するには、`git subtree push/pull` を用います。

```bash
# push
git subtree push --prefix=zenn my-zenn-repo main

# pull
git subtree push --prefix=zenn --squash my-zenn-repo main
```

これで `@username/zenn-repo` の `origin/main` ブランチと push/pull できます。

### Zenn CLI のセットアップ

Zenn は CLI による記事管理ができます。

https://zenn.dev/zenn/articles/install-zenn-cli

サブツリー `zenn/` に移動し、CLI をセットアップします。

```bash
cd ./zenn
npm install zenn-cli
npx zenn init 
```

Zenn CLI の使い方は以下の記事にあります。

https://zenn.dev/zenn/articles/zenn-cli-guide

以上の手順は、Qiita を管理しているリポジトリに対しても同様に行うことができます。

## CLI をつくる

ブログの記事ディレクトリと Zenn の記事ディレクトリは以下のような関係にあります。

```txt:ディレクトリ構造
.
├── src/
│   └── content/
│       └── article/
│           └── filename.md
└── zenn/
    └── articles/
        └── filename.md
```

以下では、`/src/content/article/filename.md` を `/zenn/articles/filename.md` へコピーし、構文を適切に変換することを考えます。

### Commander.js のセットアップ

CLI を構築するために、Node.js ベースで動作する CLI 構築ライブラリである [**Commander.js**](https://github.com/tj/commander.js) を使用します。
また、TypeScript をローカルで実行するために [**tsx**](https://github.com/privatenumber/tsx) を用います。

```bash:インストール
npm install commander
npm install --save-dev tsx
```

```ts:cli.ts
import { Command } from "commander";

const program = new Command();

// export サブコマンドを定義
program
  .command("export")
  .alias("ex")
  .description("export content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .requiredOption("-t, --type <mdtype>", 'which markdown type to use (zenn|qiita)')
  .action(async (cmd) => {
    // ここに処理を書く
  });

// parse
program
  .name("cli")
  .description("CLI")
  .version("0.0.1", "-v, --version")
  .parse(process.argv);
```

### Markdown 記法の変換処理

[私のブログで使っている Markdown 記法](https://siwl.dev/blog/articles/markdown-syntax-guide)と Zenn, Qiita の Markdown で使われている記法では、独自に実装している構文にわずかな違いがあります。

例えばコールアウトは、私のブログでは引用 `>` の拡張構文として実装しているため、Zenn/Qiita ではただの引用文として扱われるようにします[^1]。
ほかにも、埋め込みコンテンツは構文にバリエーションがあるため、特定のコンテンツに対して変換を実行します。
\
これらの変換処理は、Node.js のファイル操作 API である `fs`, `readline` を使用して実装します。

[^1]: Zenn や Qiita にもコールアウトに相当する独自構文がありますが、今回はとりあえずただの引用文に変換します。

#### 処理の実装

```ts:cli.ts
import { Command } from "commander";
import fs from "fs";
import readline from "readline";
import { exec } from "child_process";

// ...

.action((cmd) => {
  // ここに処理を書く
  const file = `./src/content/article/${cmd.filename}.md`;
  const zennFile = `./zenn/articles/${cmd.filename}.md`;

  // /zenn/articles/ に同名のファイルがある場合、処理を中断
  if (fs.existsSync(zennFile)) {
    console.log(`${zennFile} already exists!`);
    process.exit(1);
  }

  // /zenn/articles/ にファイルを作成
  exec(`touch ${zennFile}`, (_, stdout, _) => {
    console.log(stdout);
  });

  // stream, readline を初期化
  const rs = fs.createReadStream(file);
  const ws = fs.createWriteStream(zennFile);

  const rl = readline.createInterface({
    input: rs,
    output: ws,
  });
  
  // 1行ごとに変換処理
  for (const line of rl) {
    // ...
  }

  // readline を close
  rl.close();
});
```

`for-const-of` 文の中では、例えば次のような処理をします[^2]。

[^2]: 本当はコードブロック内の文のエスケープなど、細かい処理を気にする必要があります。

```ts:cli.ts
// 1行ごとに変換処理
for (const line of rl) {
  
  if (/^\> \[\!.*\]/.test(line)) {
    // コールアウトを指定する行をスキップ
    return;
  } else if (/^https:\/\/(?:www\.)?docswell\.com\/s\/[a-z0-9_-]+\/[a-zA-Z0-9-]+$/.test(line)) {
    // Docswell の埋め込み URL を Zenn の独自構文へ変換
    const newLine = `@[docswell](${line})`;
    ws.write(`${newLine.replace(/https\:\/\/(?:www\.)?docswell\.com\//, "https://www.docswell.com/")}\n`);
  } else if (...) {
    // ほかの処理
  } else {
    // 通常の行
    ws.write(`${line}\n`);
  }
}
```

#### API 呼び出しを挟む処理

私のブログでは、埋め込みたいコンテンツの URL を独立した行に書き込むことで、[**oEmbed API**](https://oembed.com) などを経由して埋め込みの `<iframe>` 要素がレンダリングされるようにしています。しかし、例えば Zenn では、Speaker Deck の埋め込みなどで構文がわずかに異なる場合があります。
\
このようなパターンに対応するため、API を叩いて返ってきたレスポンスの情報をもとに変換を行う処理を実装します。

```ts:cli.ts
.action(async (cmd) => {
  // ここに処理を書く

  // ...

  // 1行ごとに変換処理
  for await (const line of rl) {
    
    await (async => {
      if (/^https:\/\/(?:www\.)?speakerdeck\.com\/[a-z0-9_-]+\/[a-z0-9_-]+$/.test(line)) {
        // Speaker Deck の埋め込み URL を Zenn の独自構文へ変換

        // oEmbed API のレスポンス HTML
        const html = await (async (url: string): Promise<string> => {
          const endpoint = "https://speakerdeck.com/oembed.json";
          const query = encodeURIComponent(url);
          const resp = await fetch(`${endpoint}?url=${query}`);
          const json = await resp.json();
          return json.html;
        })(line);

        // スライドの ID のみを抽出
        const match = html.match(/src\=\"\/\/speakerdeck\.com\/player\/([a-z0-9]+)\" /);
        if (!match) {
          return;
        }

        // ID のみを埋め込む
        const newLine = `@[speakerdeck](${match[1]})`;
        ws.write(`${newLine}\n`);
      }
    })();

    // 後続の処理
  }
});
```

API 呼び出し中に後続の処理をブロックするため、分岐処理を `async` 即時関数でラップします。

### CLI を実行する

tsx を使用して CLI を実行できます。

```bash
npx tsx ./cli.ts ex -f filename -t zenn
```

`-t` オプションの処理は記載していませんが、引数の値に応じて処理を分岐させるために使用できます。
