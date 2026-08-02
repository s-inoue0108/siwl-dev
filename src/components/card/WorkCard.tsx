import { createSignal } from "solid-js";
import { IoLogoGithub } from "solid-icons/io";

interface Props {
	work: {
		title: string;
		description: string;
		github_url: string;
		keywords: string[];
	};
}

const getGitHubImageUrl = (url: string): string => {
	if (/^https?:\/\/(?:www\.)?github\.com/.test(url)) {
		const token = Math.floor(Date.now() / 1000).toString();
		const match = /^https?:\/\/(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/.exec(url);
		if (!match) return "/profile-image.jpg";
		const owner = match[1];
		const repo = match[2];
		return `https://opengraph.githubassets.com/${token}/${owner}/${repo}`;
	};
	return "/profile-image.jpg";
}

const WorkCard = ({ work }: Props) => {
	const [isOpenCard, setIsOpenCard] = createSignal(false);
	const { title, description, github_url, keywords } = work;

	const imageSrc = getGitHubImageUrl(github_url);

	return (
		<button
			type="button"
			title={isOpenCard() ? "Display description" : "Display title"}
			class="relative w-full hover:bg-muted-background border border-muted-background bg-muted-transparent rounded-xl transition duration-150"
			onClick={() => setIsOpenCard(!isOpenCard())}
		>
			<div class="flex flex-col">
				<div class="w-full h-36 rounded-t-xl overflow-clip">
					<img src={imageSrc} loading="lazy" class="block w-full object-cover" />
				</div>
				<div class="w-full border-t border-muted-background h-36">
					{isOpenCard() ? (
						<div class="p-2">{description}</div>
					) : (
						<div class="p-2 font-bold text-xl tracking-wide">{title}</div>
					)}
				</div>
			</div>
			<ul class="absolute bottom-1 left-2 flex items-center gap-2">
				<li>
					<a
						class="hover:opacity-70 transition duration-150"
						href={github_url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<IoLogoGithub size="1.5rem" />
					</a>
				</li>
			</ul>
			<ul class="absolute bottom-1 right-1 flex items-center gap-2">
				<li>
					{keywords.slice(0, 2).map((word: string) => (
						<span class="p-1 text-xs tracking-tight font-semibold text-muted-foreground">{`# ${word}`}</span>
					))}
				</li>
			</ul>
		</button>
	);
};

export default WorkCard;
