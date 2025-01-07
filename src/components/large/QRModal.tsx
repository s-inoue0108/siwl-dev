import QRCode from "qrcode";
import { isOpenQRModal, setIsOpenQRModal } from "../../utils/store/is-open-qrmodal";
import { Portal, Show } from "solid-js/web";
import { createSignal, onCleanup, onMount } from "solid-js";
import type { CollectionEntry } from "astro:content";
import { BsDownload } from "solid-icons/bs";
import { IoClose } from "solid-icons/io";

interface Props {
	appUrl: string;
	slug: CollectionEntry<"article">["slug"];
}

const QRModal = ({ appUrl, slug }: Props) => {
	const [QR, setQR] = createSignal<string | null>(null);
	const url = `${appUrl}/blog/articles/${slug}`;

	onMount(async () => {
		setIsOpenQRModal(false);
		await (async () => {
			const src = await QRCode.toDataURL(url);
			setQR(src);
		})();
	});

	onCleanup(() => {
		setIsOpenQRModal(false);
		setQR("");
	});

	return (
		<Portal mount={document.body}>
			<Show when={isOpenQRModal() && QR()}>
				<div class="fixed top-0 left-0 z-[200] w-full h-full bg-muted-background/90 flex justify-center items-center">
					<ul class="flex flex-col items-center gap-4">
						<li>
							<div class="text-2xl font-bold text-center text-foreground mb-8">
								QR コードで記事をシェア
							</div>
						</li>
						<li>
							<img src={QR() ?? ""} alt={slug} class="rounded-md" />
						</li>
						<li>
							<a
								href={QR() ?? ""}
								download={`${slug}.png`}
								class="px-3 py-2 rounded-xl bg-gradient-to-r from-accent-sub-base to-accent-base flex items-center gap-2 text-foreground text-xl font-bold hover:opacity-70 transition duration-150"
							>
								<BsDownload />
								<span>ダウンロード</span>
							</a>
						</li>
						<li>
							<button
								type="button"
								onClick={() => setIsOpenQRModal(false)}
								class="mt-8 flex items-center gap-2 text-foreground text-xl font-bold hover:opacity-70 transition duration-150"
							>
								<IoClose />
								<span>閉じる</span>
							</button>
						</li>
					</ul>
				</div>
			</Show>
		</Portal>
	);
};

export default QRModal;
