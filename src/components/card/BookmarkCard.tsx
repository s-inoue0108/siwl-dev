import type { CollectionEntry } from "astro:content";

interface OgpData {
	url: string;
	resUrl: string;
	sitename: string;
	title: string;
	description: string;
	image: string;
	favicon: string;
}

interface Props {
	bookmark: OgpData & { name: CollectionEntry<"bookmark">["data"]["name"] };
}

const BookmarkCard = ({ bookmark }: Props) => {
	const { url, resUrl, name, description, image, favicon } = bookmark;

	return (
		<div class="w-full h-24 xl:h-36 border border-muted-background bg-muted-transparent rounded-xl hover:bg-muted-background transition duration-200">
			<a class="bare-link-card" href="${url}" target="_blank" rel="noopener noreferrer">
				<div class="flex flex-row-reverse items-center">
					<div class="border-l border-muted-background w-32 h-24 xl:w-96 xl:h-36">
						{image && image !== ""
							? `
              <img
                src="${image}"
                class="w-full h-full object-cover rounded-r-[calc(0.75rem-1px)]"
              />
            `
							: `
              <div class="bg-gradient-to-r from-accent-sub-base to-accent-base w-full h-full flex items-center justify-center rounded-r-[calc(0.75rem-1px)]">
                <span class="text-lg font-semibold">No Image</span>
              </div>
            `}
					</div>
					<div class="relative flex flex-col gap-2 xl:gap-4 px-2 py-1 xl:px-3 xl:py-2 w-full h-24 xl:h-36">
						<div class="font-bold xl:text-xl truncate">{name}</div>
						<div class="h-12 xl:h-16 text-xs xl:text-base text-muted-foreground truncate">
							{description}
						</div>
						<div class="absolute bottom-1 left-1 xl:bottom-2 xl:left-2 flex items-center gap-1 xl:gap-2 w-[calc(100%-1rem)]">
							{favicon && favicon !== ""
								? `
                <div class="h-3 xl:h-4">
                  <img src="${favicon}" class="h-full object-contain" />
                </div>
              `
								: `
                <div class="h-3 xl:h-4">
                  <svg class="h-full fill-muted-foreground" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48Z"></path><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 48c-58.07 0-112.67 93.13-112.67 208S197.93 464 256 464s112.67-93.13 112.67-208S314.07 48 256 48Z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M117.33 117.33c38.24 27.15 86.38 43.34 138.67 43.34s100.43-16.19 138.67-43.34M394.67 394.67c-38.24-27.15-86.38-43.34-138.67-43.34s-100.43 16.19-138.67 43.34"></path><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 48 256 464"></path><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M464 256 48 256"></path></svg>
                </div>
              `}
							<span class="font-code text-xs xl:text-sm text-muted-foreground whitespace-nowrap truncate">
								{resUrl && resUrl !== "" ? new URL(resUrl).origin : new URL(url).origin}
							</span>
						</div>
					</div>
				</div>
			</a>
		</div>
	);
};

export default BookmarkCard;
