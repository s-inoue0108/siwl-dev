import type { CollectionEntry } from "astro:content";
import { IoShareSocialOutline, IoCopyOutline } from "solid-icons/io";
import { SiGithub, SiMarkdown } from "solid-icons/si";
import { BsCheckLg } from "solid-icons/bs";
import Panel from "./Panel";
import { createSignal } from "solid-js";

interface Props {
	appOwner: string;
	appUrl: string;
	body: CollectionEntry<"article">["body"];
	title: CollectionEntry<"article">["data"]["title"];
	description: CollectionEntry<"article">["data"]["description"];
	slug: CollectionEntry<"article">["slug"];
}

const Shares = ({ appOwner, appUrl, body, title, description, slug }: Props) => {
	const url = `${appUrl}/blog/articles/${slug}`;
	const gitHubUrl = `https://github.com/s-inoue0108/siwl-dev/tree/main/src/content/article/${slug}.md`;

	const [isClickLinkCopyBtn, setIsClickLinkCopyBtn] = createSignal(false);
	const [isClickMarkdownCopyBtn, setIsClickMarkdownCopyBtn] = createSignal(false);

	const copyLink = () => {
		navigator.clipboard.writeText(url);
		setIsClickLinkCopyBtn(true);

		setTimeout(() => setIsClickLinkCopyBtn(false), 1000);
	};

	const copyMarkdown = () => {
		navigator.clipboard.writeText(body);
		setIsClickMarkdownCopyBtn(true);

		setTimeout(() => setIsClickMarkdownCopyBtn(false), 1000);
	};

	const shareLink = () => {
		navigator.share({
			title: `${title} | ${appOwner}`,
			text: description ?? "",
			url,
		});
	};

	return (
		<Panel
			title="Menu"
			isShowToggleButton={false}
			Content={
				<div class="flex flex-wrap items-center gap-4">
					<button
						type="button"
						title="Share"
						class="text-muted-foreground font-semibold border border-muted-background px-2 py-1 rounded-lg text-lg hover:text-foreground hover:bg-muted-background transition duration-150 flex items-center gap-2"
						onClick={() => shareLink()}
					>
						<IoShareSocialOutline />
						<span>Share</span>
					</button>
					<button
						type="button"
						title="Copy link"
						class="text-muted-foreground text-2xl hover:text-foreground transition duration-150"
						onClick={() => copyLink()}
					>
						{isClickLinkCopyBtn() ? <BsCheckLg /> : <IoCopyOutline />}
					</button>
					<button
						type="button"
						title="Copy markdown text"
						class="text-muted-foreground text-2xl hover:text-foreground transition duration-150"
						onClick={() => copyMarkdown()}
					>
						{isClickMarkdownCopyBtn() ? <BsCheckLg /> : <SiMarkdown />}
					</button>
					<a
						href={gitHubUrl}
						title="View on GitHub"
						target="_blank"
						rel="noopener noreferrer"
						class="text-muted-foreground text-2xl hover:text-foreground transition duration-150"
					>
						<SiGithub />
					</a>
				</div>
			}
		/>
	);
};

export default Shares;
