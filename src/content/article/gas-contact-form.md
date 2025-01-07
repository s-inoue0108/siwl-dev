---
isDraft: false
title: SolidJS + Astro SSR + GAS で静的サイトにフォームを実装する
category: tech
tags: [astro, solid, gas]
description: お問い合わせフォームに、Astro の SSR 機能と Google Apps Script を利用したメール通知機能を実装しました。
publishDate: 2024-12-08T17:54:26+09:00
updateDate: 2025-01-07T23:35:57+09:00
relatedArticles: [astro-katex-ssr]
---

## バージョン情報

- Astro `v4.15.9`
- @astrojs/cloudflare `v9.2.1`
- TypeScript `v5.6.2`

執筆時点で Astro `v5` がリリースされていますが、`v4` の環境です。また、@astrojs/cloudflare は Latest Release (`v12`) のものを用いるとデプロイに失敗するため、`v9` を用いています。

## reCAPTCHA の用意

GAS アプリケーションとの通信を [Google reCAPTCHA](https://www.google.com/recaptcha/about/) (`v3`) によりフィルタリングします。次の URL へアクセスし、reCAPTCHA 認証のためのサイトキーとシークレットキーを取得します。

> [!tip]
>
> 開発サーバーからのリクエストを検証したい場合、`localhost` からの認証をするためのキーを別途取得しておくとよいです。

キーは環境変数に保存します。

```dotenv:.env
PUBLIC_SITE_KEY=****************
SECRET_KEY=****************
```

Astro では、`PUBLIC_` プレフィックスをつけた変数のみをクライアントサイドで利用できます。サイトキーはクライアントサイドから参照するため、これをつけておきます。

https://docs.astro.build/ja/guides/environment-variables/

## GAS の実装

[Google Apps Script](https://script.google.com/) の `doPost` 関数でフォームからの通信を受け取り、`Gmail.sendEmail` 関数で通知メールを送信する仕組みを作ります。

```js:GAS
const sendMail = (name, email, content) => {

  const subject = "お問い合わせを受け付けました";

  const body = `${name} 様\n以下の内容でお問い合わせを受け付けました。\n\n${content}`;

  const options = {
    name: "Your name",
  }

  GmailApp.sendEmail(email, subject, body, options);
};

const doPost = e => {
  // For Debug
  // const { name, email, content } = JSON.parse(e);
  // Logger.log(e);

  const { name, email, content } = JSON.parse(e.postData.contents);

  sendMail(name, email, content);

  const payload = JSON.stringify({
    method: "POST",
    message: "お問い合わせを受け付けました！",
  });
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
};

// For Debug
const doPostTest = () => {
  const payload = {
    name: "Test User",
    email: "test@example.com",
    content: "TEST TEST TEST",
  }

  doPost(JSON.stringify(payload));
}
```

`doPost` 関数は POST リクエストを受け取ると自動で実行されます。リクエストボディは引数 `e` に対し `e.postData.contents` プロパティでアクセスできるので、これを `JSON.parse` して処理します。

## フォームの実装

フォームは [SolidJS](https://www.solidjs.com/) で作成しました。まず、フォームの値とレスポンスの情報を格納するための State を宣言します。

```tsx:ContactForm.tsx
import { createSignal } from "solid-js";

const ContactForm = () => {
  const [name, setName] = createSignal("");
	const [email, setEmail] = createSignal("");
	const [content, setContent] = createSignal("");
	const [isAgree, setIsAgree] = createSignal(false);
	const [recaptchaToken, setRecaptchaToken] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const [isOpen, setIsOpen] = createSignal(false);
	const [isSucsess, setIsSucsess] = createSignal(false);

  return (
    // ...
  );
}
export default ContactForm;
```

### Hooks を利用して reCAPTCHA スクリプトを動的に読み込む

`onMount` フックでスクリプトを動的に非同期読み込みします。サイトキーを読み込んで使用します。

```tsx:ContactForm.tsx
import { onMount, onCleanup } from "solid-js";

onMount(() => {
	const script = document.createElement("script");
	script.src = `https://www.google.com/recaptcha/api.js?render=${
		import.meta.env.PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY
	}`;

	script.async = true;
	document.head.appendChild(script);

	onCleanup(() => {
		if (script.parentNode) {
			script.parentNode.removeChild(script);
		}
	});
});
```

### フォームの送信処理

型補完のために `@types/grecaptcha` をインストールします。

```bash
$ npm i -D @types/grecaptcha
```

`executeRecaptcha` 関数はサイトキーの情報をもとにトークンを取得し、State にセットします。これをフォームの値とともに `/api/contact` エンドポイントへ送信します。レスポンスを受けとったら、フォームのリセットとレスポンス内容の画面通知を行います。

```tsx:ContactForm.tsx
const executeRecaptcha = async () => {
	try {
		const token = await window.grecaptcha.execute(
			import.meta.env.PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY,
			{
				action: "submit",
			}
		);
		setRecaptchaToken(token);
	} catch (error) {
		console.error("reCAPTCHA error:", error);
	}
};

	// フォーム送信処理
const handleSubmit = async (e: SubmitEvent) => {
	e.preventDefault();
	setIsSubmitting(true);

	// reCAPTCHA を実行してトークンを取得
	await executeRecaptcha();

	// サーバーへの送信処理
	const response = await fetch("/api/contact", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: name(),
			email: email(),
			content: content(),
			recaptchaToken: recaptchaToken(),
		}),
	});

	if (response.ok) {
		setName("");
		setEmail("");
		setContent("");
		setIsAgree(false);
		setIsSucsess(true);
	} else {
		setIsAgree(false);
		setIsSucsess(false);
	}

	setIsSubmitting(false);
	setIsOpen(true);
	setTimeout(() => setIsOpen(false), 10000);
};
```

### フォーム HTML

スタイリングに [Tailwind CSS](https://tailwindcss.com/) を用いています。`name, email, content` プロパティを格納する `<input>` 要素と、`<Portal>` によるレスポンスの通知モーダルを付けています。

```tsx:ContactForm.tsx
<>
	<form class="mx-auto w-full flex flex-col gap-6" onSubmit={handleSubmit}>
		<div class="flex flex-col gap-2">
			<label for="contact-name">
				<span>お名前</span>
				<span class="text-red-500"> *</span>
			</label>
			<input
				class="rounded-lg p-2 focus:ring-0 focus:outline-blue-500 focus:outline-2"
				type="text"
				id="contact-name"
				value={name()}
				onInput={(e) => setName(e.target.value)}
				required
			/>
		</div>
		<div class="flex flex-col gap-2">
			<label for="contact-email">
				<span>メールアドレス</span>
				<span class="text-red-500"> *</span>
			</label>
			<input
				class="rounded-lg p-2 focus:ring-0 focus:outline-blue-500 focus:outline-2"
				type="email"
				id="contact-email"
				value={email()}
				onInput={(e) => setEmail(e.target.value)}
				required
			/>
		</div>
		<div class="flex flex-col gap-2">
			<label for="contact-content">
				<span>お問い合わせ内容</span>
				<span class="text-red-500"> *</span>
			</label>
			<textarea
				class="resize-none rounded-lg p-2 focus:ring-0 focus:outline-blue-500 focus:outline-2"
				id="contact-content"
				value={content()}
				onInput={(e) => setContent(e.target.value)}
				required
				rows={10}
			/>
		</div>

		<div class="mx-auto flex items-center">
			<input
				id="contact-checkbox"
				type="checkbox"
				checked={isAgree()}
				onInput={(e) => setIsAgree(e.target.checked)}
				class="w-4 h-4 rounded focus:ring-blue-500 focus:ring-2"
				required
			/>
			<label for="contact-checkbox" class="ms-2 text-sm font-medium">
				<a
					href="/privacy-policy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-500 visited:text-purple-500 hover:underline"
				>
					プライバシーポリシー↗
				</a>{" "}
				に同意する
			</label>
		</div>

		<div class="mx-auto">
			<button
				class="w-40 flex items-center justify-center font-bold bg-gradient-to-r from-accent-sub-base to-accent-base px-4 py-2 rounded-lg"
				type="submit"
			>
				{isSubmitting() ? (
					<span class="flex items-center gap-2">
						<span>送信中...</span>
					</span>
				) : (
					<span class="flex items-center gap-2">
						<span>送信する</span>
					</span>
				)}
			</button>
		</div>
	</form>
	<Portal mount={document.body}>
		<Show when={isOpen()}>
			<div
				class={`w-full z-[100] fixed bottom-0 left-0 ${
					isSucsess() ? "bg-green-600" : "bg-red-600"
				} } p-4`}
			>
				<button type="button" onClick={() => setIsOpen(false)} class="absolute top-2 right-2">×</button>
				<div class="text-center flex flex-col gap-2">
					<div>
						{isSucsess() ? "お問い合わせを受け付けました" : "送信に失敗しました"}
					</div>
					<div>
						{isSucsess()
							? "メールボックスをご確認ください。"
							: "お手数ですが、もう一度お試しください。"}
					</div>
				</div>
			</div>
		</Show>
	</Portal>
</>
```

## サーバーサイドの実装

Astro のエンドポイントを用いて、reCAPTCHA サーバーに検証リクエスト、次いで GAS アプリケーションにリクエストを送るサーバーを実装します。

### SSR アダプターの導入

Astro `v4` では SSR（On-demand Rendering）を利用するために、ホスト先のランタイム環境に対応したアダプターを用意する必要があります。今回は Cloudflare のアダプターを用います（他にも Vercel や Netlify 向けのアダプターがあります）。

```bash:インストール
$ npm astro add cloudflare
```

`astro.config.mjs` に次の内容を追記します。

```js:astro.config.mjs
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  // ...
  output: "hybrid",
  adapter: cloudflare(),
})
```

> [!important] Astro v5 の場合
>
> Astro `v5` ではレンダリングオプション `hybrid` が[削除されたようです](https://docs.astro.build/en/guides/upgrade-to/v5/#removed-hybrid-rendering-mode)。SSG ベースのプロジェクトの一部で SSR を利用するためには、代わりに `static` オプションを利用します。

### エンドポイントの実装

Astro では、`src/pages` 以下に配置した `ts` ファイルをサーバーサイド TypeScript として扱うことができます。

https://docs.astro.build/ja/guides/endpoints/

今回は、フォームからの入力を受け取り、reCAPTCHA と GAS に POST 通信するエンドポイントを `src/pages/api/contact.ts` として作成します（生成されるパスは `/api/contact` となります）。以下に気を付けます：

- SSR のために `export default prerender = false` をヘッダに指定します。
- reCAPTCHA リクエストの `body` にはシークレットキーと、クライアント側で発行したトークンを含めます。リクエストヘッダーは `"Content-Type": "application/x-www-form-urlencoded"` です。
- reCAPTCHA 認証を行うためのエンドポイントは `https://www.google.com/recaptcha/api/siteverify` です。

```ts:src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { name, email, content, recaptchaToken } = await request.json();

  // reCAPTCHA リクエストボディ
  const recaptchaRequestBody = new URLSearchParams({
    secret: import.meta.env.SECRET_KEY,
    response: recaptchaToken
  });

  // reCAPTCHA へのリクエスト
   const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: recaptchaRequestBody.toString()
  });

  const recaptchaResponseData = await recaptchaResponse.json();

  if (recaptchaResponseData.success) {
    // reCAPTCHA 検証成功
    // GAS へのリクエスト
    const response = await fetch(import.meta.env.GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        content,
      }),
    });

    const responseData = await response.json();

    if (responseData.error) {
      // GAS リクエスト失敗
      return new Response(null, { status: 400 });
    }

    // GAS リクエスト成功
    return new Response(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 200
    });
  }

  // reCAPTCHA 検証失敗
  return new Response(null, { status: 400 });
}
```

## おわりに

reCAPTCHA は React を使用しているのであれば `react-google-grecaptcha` を利用するのが手軽かと思いますが、SolidJS と JS 標準の Fetch API で実装できました。
GAS は Google スプレッドシートなどを接続し、内容を管理するのもいいかと思います。