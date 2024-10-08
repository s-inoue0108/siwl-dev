import type { CollectionEntry } from "astro:content";
import { SiFacebook, SiMisskey, SiTwitter, SiHatenabookmark } from "solid-icons/si";
import Panel from "./Panel";

interface Props {
	title: CollectionEntry<"article">["data"]["title"];
	slug: CollectionEntry<"article">["slug"];
}

const Shares = ({ title, slug }: Props) => {
	const text = encodeURIComponent(`${title} | ${import.meta.env.APP_NAME}`);
	const url = `${import.meta.env.APP_URL}/blog/article/${slug}`;

	const facebookLink = `https://www.facebook.com/share.php?u=${url}`;
	const xLink = `https://x.com/share?url=${url}&text=${text}&via=si_library_net`;
	const hatenaLink = `http://b.hatena.ne.jp/entry/${url}`;
	const misskeyLink = `https://misskey-hub.net/share/?text=${text}&url=${url}&visibility=public&localOnly=0`;
	return (
		<Panel
			title="Share"
			isShowToggleButton={false}
			Content={
				<ul class="flex items-center gap-6">
					<li>
						<a
							href={facebookLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground text-2xl hover:text-foreground transition-colors duration-150"
						>
							<SiFacebook />
						</a>
					</li>
					<li>
						<a
							href={xLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground text-2xl hover:text-foreground transition-colors duration-150"
						>
							<SiTwitter />
						</a>
					</li>
					<li>
						<a
							href={hatenaLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground text-2xl hover:text-foreground transition-colors duration-150"
						>
							<SiHatenabookmark />
						</a>
					</li>
					<li>
						<a
							href={misskeyLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-muted-foreground text-lg sm:text-xl lg:text-2xl hover:text-foreground transition-colors duration-150"
						>
							<SiMisskey />
						</a>
					</li>
				</ul>
			}
		/>
	);
};

export default Shares;
