import type { CollectionEntry } from "astro:content";
import { SiFacebook, SiMisskey, SiTwitter, SiHatenabookmark } from "solid-icons/si";
import { BsQrCode } from "solid-icons/bs";
import Panel from "./Panel";
import { isOpenQRModal, setIsOpenQRModal } from "../../utils/store/is-open-qrmodal";
import QRModal from "./QRModal";

interface Props {
	appOwner: string;
	appUrl: string;
	title: CollectionEntry<"article">["data"]["title"];
	slug: CollectionEntry<"article">["slug"];
}

const Shares = ({ appOwner, appUrl, title, slug }: Props) => {
	const text = encodeURIComponent(`${title} | ${appOwner}`);
	const url = `${appUrl}/blog/articles/${slug}`;

	const facebookLink = `https://www.facebook.com/share.php?u=${url}`;
	const xLink = `https://x.com/share?url=${url}&text=${text}&via=si_library_net`;
	const hatenaLink = `http://b.hatena.ne.jp/entry/${url}`;
	const misskeyLink = `https://misskey-hub.net/share/?text=${text}&url=${url}&visibility=public&localOnly=0`;
	return (
		<>
			<Panel
				title="Share"
				isShowToggleButton={false}
				Content={
					<div class="flex flex-wrap items-center gap-6">
						<a
							href={facebookLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground text-2xl hover:text-foreground transition-colors duration-150"
						>
							<SiFacebook />
						</a>
						<a
							href={xLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground text-2xl hover:text-foreground transition-colors duration-150"
						>
							<SiTwitter />
						</a>
						<a
							href={hatenaLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground text-2xl hover:text-foreground transition-colors duration-150"
						>
							<SiHatenabookmark />
						</a>
						<a
							href={misskeyLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground text-lg sm:text-xl lg:text-2xl hover:text-foreground transition-colors duration-150"
						>
							<SiMisskey />
						</a>
						<button type="button" onClick={() => setIsOpenQRModal(true)}>
							<BsQrCode class="text-muted-foreground text-2xl hover:text-foreground transition-colors duration-150" />
						</button>
					</div>
				}
			/>
			<QRModal appUrl={appUrl} slug={slug} />
		</>
	);
};

export default Shares;
