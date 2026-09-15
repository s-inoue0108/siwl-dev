---
isDraft:         false
isLimited:       false
title:           書評サイトを作る
category:        tech
tags:            [astro, markdown, poem]
description:     Google Books API を使った書評用の Web ページを作成しました。
publishDate:     2026-09-15T23:40:34+09:00
updateDate:      2026-09-16T00:30:36+09:00
relatedArticles: []
---

## 本が読みたい

と、最近ずっと考えてはいるのですが、インターネットのコンテンツによく焼きされた忍耐力のない脳みそでは活字すらまともに読めないのです。最近の言葉で言うなら、ドパガキというやつでしょうか。

@{wiki}(ドパガキ)

何か先立つものがなくちゃな！ということで、本を読むモチベーションを少しでも上げるために[書評ページ](/library/1)を本サイトに実装しました。読み終わった本の書影を感想（あるいは批評）とともに配列することで、<i>**いっぱい、読んじゃったﾅ...**</i> という満足感を演出してやろうという試みです。

## ISBN から書誌情報を取得する

書評を書くときの面倒くささを少しでも軽減するために、書籍情報をシステムに登録する手間はできるだけ省きたいもののです。ところで、書籍の一意な識別子は **ISBN** という規格として知られています。

@{wiki}(ISBN)

そこで今回、読み終わった本の裏表紙にある13桁の ISBN から書籍の基本情報を API で取得することにしました。リサーチしたところ、書誌情報 API で一般に使えるものはとしては、以下が知られているみたいです。

-----

- [国立国会図書館 (NDL) サーチ API](https://ndlsearch.ndl.go.jp/help/api/specifications)
  - 非営利目的であれば申請なしで使用可能。以前は書影も提供していたが、今は使えない模様...
- [Google Books APIs](https://developers.google.com/books/docs/v1/using?hl=ja)
  - Google が提供する API で、海外の書籍にも強い。書影もあり。発売されたばかりの最新の和書なんかは登録されてなさそう。まともに使おうと思うと API key の発行が必要。
- [openBD API](https://openbd.jp/)
  - カーリルと版元ドットコムにより提供されていたがすでに運用が終了しており、他の API への移行が推奨されている。
- 他の Web 企業が運用している API
  - 楽天や Amazon など、自社の EC サイトを持っている企業である場合が多そう。

-----

書誌情報の豊富さや制約との兼ね合いから、今回は Google Books APIs を選択することにしました。

## Google Books APIs による書誌情報取得

別に特別な実装はなく、所定のエンドポイントに GET リクエストするだけです。クエリパラメータに ISBN を仕込むことができるので、その機能を使います。

なお、リクエストヘッダーに `X-Goog-Api-Key` というフィールドを持たせ、その値に Books APIs へのアクセス権限を持つ API key を渡しています。

```ts
export interface BookInfo {
    title: string;
    author?: string;
    publisher?: string;
    publishedDate?: string;
    coverUrl?: string;
};

export async function getBookInfo(
    isbn: string,
): Promise<BookInfo | null> {
    // Google Books API
    const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`,
        {
            headers: {
                "X-Goog-Api-Key": import.meta.env.GOOGLE_BOOKS_API_KEY,
            },
        },
    );

    if (!res.ok) {
        throw new Error(`Google Books API error: ${res.status}`);
    }

    const data = await res.json()
    const volumeInfo = data.items?.[0]?.volumeInfo
    if (!volumeInfo) {
        return null;
    }

    return {
        title: volumeInfo.title ?? "",
        author: volumeInfo.authors?.join(", "),
        publisher: volumeInfo.publisher,
        publishedDate: volumeInfo.publishedDate,
        coverUrl: volumeInfo.imageLinks?.thumbnail?.replace(
            /^http:/,
            "https:",
        ),
    };
}
```

## Astro で SSG する

Books APIs は利用制限が厳しそうみたいで、開発時によく 429 Quota Exceeded が発生してました（1,000 requests/day みたいです）。書誌情報は時間経過で内容が変わるなどはないので SSG を採用し、プリレンダリング時にのみ API リクエストをすれば十分です。JSON にキャッシュしておくとか実装してもいいかもしれません。
\
古い Astro (`v4`) を使っているので、Content collection + `getStaticPaths` で SSG を実装します。コレクションは Markdown で管理されており、フロントマターは以下のような形式です。

```yaml
isDraft: false   # 下書きかどうか
isbn13: "9784101010014"   # ISBN-13
reviewDate: YYYY-MM-DDTHH:MM:SS+09:00   # レビューした日付
rating: 3   # 評価 (1以上5以下の整数)
```

Astro 側の実装は以下のようになっています。UI の関係で、Markdown 本文はレンダリング時に平文に変換されるようにしました。
Markdown -> string の変換は以下のプラグインを使っています。

https://github.com/zuchka/remove-markdown

```astro
---
import removeMarkdown from "remove-markdown";

export const getStaticPaths = async ({ paginate }: GetStaticPathsOptions) => {
	const readlogs = await getCollection("library", ({ data }) => {
		return import.meta.env.PROD ? !data.isDraft : true;
	});

	const sortedReadlogs = readlogs.sort((a, b) => {
		return b.data.reviewDate.getTime() - a.data.reviewDate.getTime();
	});

	const readlogWithBookInfo = await Promise.all(
		sortedReadlogs.map(async (readlog) => ({
			info: await getBookInfo(readlog.data.isbn13),
			readlog,
			body: removeMarkdown(readlog.body),
		})),
	);

	return paginate(readlogWithBookInfo, {
		pageSize: 30,
	});
};

const { page } = Astro.props;
---
```

## まとめ・今後の展望

凝った作りではないですが、これで満足せずしっかり本が読めるようになるといいなあ（願望）

AI との連携も見据えて、書評を JSON か XML なんかに書き出してダウンロードできるようにする実装もしたいですね。
