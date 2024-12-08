import { createSignal, onMount, onCleanup } from "solid-js";

const ContactForm = () => {
	const [name, setName] = createSignal("");
	const [email, setEmail] = createSignal("");
	const [content, setContent] = createSignal("");
	const [recaptchaToken, setRecaptchaToken] = createSignal("");

	// reCAPTCHA v3 スクリプトを読み込む
	onMount(() => {
		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/api.js?render=${
			import.meta.env.PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY
		}`;
		script.async = true;
		document.head.appendChild(script);

		onCleanup(() => {
			// クリーンアップ
			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}
		});
	});

	// reCAPTCHA トークンの取得
	const executeRecaptcha = async () => {
		try {
			const token = await window.grecaptcha.execute(
				import.meta.env.PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY,
				{
					action: "submit",
				}
			);
			setRecaptchaToken(token); // トークンをセット
		} catch (error) {
			console.error("reCAPTCHA error:", error);
		}
	};

	// フォーム送信処理
	const handleSubmit = async (e: any) => {
		e.preventDefault();

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
			alert("Message sent successfully!");
		} else {
			alert("Error sending message.");
		}
	};

	return (
		<form class="mx-auto w-full lg:w-1/2 flex flex-col gap-6" onSubmit={handleSubmit}>
			<div class="flex flex-col gap-2">
				<label class="text-lg font-semibold" for="contact-name">
					<span>お名前</span>
					<span class="text-red-500"> *</span>
				</label>
				<input
					class="rounded-lg p-2 bg-muted-background focus:outline-accent-vivid focus:outline-4"
					type="text"
					id="contact-name"
					value={name()}
					onInput={(e) => setName(e.target.value)}
					required
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-lg font-semibold" for="contact-email">
					<span>メールアドレス</span>
					<span class="text-red-500"> *</span>
				</label>
				<input
					class="rounded-lg p-2 bg-muted-background focus:outline-accent-vivid focus:outline-4"
					type="email"
					id="contact-email"
					value={email()}
					onInput={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-lg font-semibold" for="contact-content">
					<span>お問い合わせ内容</span>
					<span class="text-red-500"> *</span>
				</label>
				<textarea
					class="rounded-lg p-2 bg-muted-background focus:outline-accent-vivid focus:outline-4"
					id="contact-content"
					value={content()}
					onInput={(e) => setContent(e.target.value)}
					required
					rows={10}
				/>
			</div>
			<div class="mx-auto">
				<button
					class="font-bold bg-gradient-to-r from-accent-sub-base to-accent-base px-4 py-2 rounded-lg"
					type="submit"
				>
					送信する
				</button>
			</div>
		</form>
	);
};

export default ContactForm;
