import { createSignal, onMount, onCleanup } from "solid-js";
import { Portal, Show } from "solid-js/web";
import { BiRegularLoaderAlt } from "solid-icons/bi";
import { IoCloseCircleOutline, IoMail } from "solid-icons/io";

const ContactForm = () => {
	const [name, setName] = createSignal("");
	const [email, setEmail] = createSignal("");
	const [content, setContent] = createSignal("");
	const [isAgree, setIsAgree] = createSignal(false);
	const [recaptchaToken, setRecaptchaToken] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const [isOpen, setIsOpen] = createSignal(false);
	const [isSucsess, setIsSucsess] = createSignal(false);

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

	return (
		<>
			<form class="mx-auto w-full lg:w-1/2 flex flex-col gap-6" onSubmit={handleSubmit}>
				<div class="flex flex-col gap-2">
					<label class="text-lg font-semibold" for="contact-name">
						<span>お名前</span>
						<span class="text-red-500"> *</span>
					</label>
					<input
						class="rounded-lg p-2 bg-muted-background/30 border-muted-background focus:outline-accent-vivid focus:outline-2"
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
						class="rounded-lg p-2 bg-muted-background/30 border-muted-background focus:outline-accent-vivid focus:outline-2"
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
						class="resize-none rounded-lg p-2 bg-muted-background/30 border-muted-background focus:outline-accent-vivid focus:outline-2"
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
						class="w-4 h-4 text-accent-vivid bg-muted-background/30 border-muted-background rounded focus:ring-blue-500 focus:ring-2"
						required
					/>
					<label for="contact-checkbox" class="ms-2 text-sm font-medium">
						<a
							href="/privacy-policy"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sky visited:text-purple hover:underline"
						>
							プライバシーポリシー
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
								<BiRegularLoaderAlt size={"1.2rem"} class="animate-spin" />
								<span>送信中...</span>
							</span>
						) : (
							<span class="flex items-center gap-2">
								<IoMail size={"1.2rem"} />
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
						} } p-4 animate-fade-in`}
					>
						<button type="button" onClick={() => setIsOpen(false)} class="absolute top-2 right-2">
							<IoCloseCircleOutline size={"1.5rem"} />
						</button>
						<div class="text-center flex flex-col gap-2">
							<div class="font-bold text-xl">
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
	);
};

export default ContactForm;
