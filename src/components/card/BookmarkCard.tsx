import { IoGlobeOutline } from "solid-icons/io";
import { ImLink } from "solid-icons/im";
import type { BookmarkWithOgp } from "../../pages/bookmarks/[page].astro";

interface Props {
	bookmark: BookmarkWithOgp;
}

const getFaviconUrl = (url: string, favicon: string | undefined) => {
	if (!favicon) return;

	if (/^https?:\/\//.test(favicon)) {
		return favicon;
	}

	if (favicon.startsWith("/")) {
		return `${new URL(url).origin}${favicon}`;
	}

	return `${new URL(url).origin}/${favicon}`;
};

const BookmarkCard = ({ bookmark }: Props) => {
	const { url, resUrl, name, sitename, title, description, image, favicon } = bookmark;
	const faviconUrl = getFaviconUrl(url, favicon);

	return (
		<div class="w-full h-24 xl:h-36 border border-muted-background bg-muted-transparent rounded-xl shadow-lg hover:bg-muted-background transition duration-200">
			<a href={resUrl ?? url} target="_blank" rel="noopener noreferrer">
				<div class="flex items-center">
					<div class="border-r border-muted-background w-32 xl:w-64 h-24 xl:h-36">
						{image && image[0] ? (
							<img
								src={image[0].url}
								class="w-full h-full object-cover rounded-l-[calc(0.75rem-1px)]"
							/>
						) : (
							<div class="bg-gradient-to-r from-accent-sub-base to-accent-base w-full h-full flex items-center justify-center rounded-l-[calc(0.75rem-1px)]">
								<ImLink class="w-6 h-6 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10" />
							</div>
						)}
					</div>
					<div class="relative flex flex-col px-2 py-1 w-full h-24 xl:h-36">
						<h2 class="font-bold text-lg xl:text-xl truncate">{title ?? sitename ?? name}</h2>
						<p class="text-sm xl:text-lg text-muted-foreground truncate">{description}</p>
						<div class="absolute bottom-2 left-2 flex items-center gap-1 w-[calc(100%-1rem)]">
							{faviconUrl && faviconUrl !== "" ? (
								<img src={faviconUrl} class="w-4 h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" />
							) : (
								<IoGlobeOutline class="w-4 h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-muted-foreground" />
							)}
							<span class="font-code text-xs xl:text-base text-muted-foreground whitespace-nowrap truncate">
								{resUrl ?? url}
							</span>
						</div>
					</div>
				</div>
			</a>
		</div>
	);
};

export default BookmarkCard;
