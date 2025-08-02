import { type CollectionEntry } from "astro:content";
import { Portal, Show } from "solid-js/web";
import { createSignal, onMount } from "solid-js";
import { IoCloseCircleOutline, IoLogoGithub } from "solid-icons/io";
import { ImLink } from "solid-icons/im";
import { BsCardImage } from "solid-icons/bs";

interface Props {
	work: CollectionEntry<"work" | "achievement">;
}

const WorkCard = ({ work }: Props) => {
	const [isOpenCard, setIsOpenCard] = createSignal(false);

	return (
		<>
			<button
				type="button"
				class="relative w-full lg:w-96 flex flex-col border border-muted-background bg-muted-background/30 rounded-xl hover:opacity-70 transition-opacity duration-200"
				onClick={() => setIsOpenCard(true)}
			>
				<span class="w-full h-40">
					{work.data.image ? (
						<img
							src={work.data.image.src}
							loading="lazy"
							class="rounded-t-xl object-cover w-full h-full"
						/>
					) : (
						<BsCardImage class="w-full h-full from-accent-sub-base to-accent-base bg-gradient-to-r rounded-t-xl" />
					)}
				</span>
				<span class="px-2 py-4 w-full border-t border-muted-background h-48">
					<span class="font-bold text-xl tracking-wide">{work.data.title}</span>
					<ul class="absolute bottom-2 left-0 flex items-center gap-2">
						<li>
							{work.data.keywords.slice(0, 4).map((word) => (
								<span class="px-2 py-1 text-xs font-bold text-muted-foreground rounded-md">
									{`#${word}`}
								</span>
							))}
						</li>
					</ul>
				</span>
			</button>
			<Portal mount={document.body}>
				<Show when={isOpenCard()}>
					<div class="p-8 z-[100] w-full h-full fixed top-0 left-0 overflow-y-auto bg-background/90 animate-fade-in-fast">
						<div class="w-full lg:w-1/2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
							<button
								type="button"
								onClick={() => setIsOpenCard(false)}
								class="absolute top-[-3.5rem] right-1"
							>
								<IoCloseCircleOutline size={"3rem"} />
							</button>
							{work.data.image ? (
								<img src={work.data.image.src} loading="lazy" class="w-2/3 h-2/3 mx-auto" />
							) : (
								<BsCardImage class="w-1/4 h-1/4 mx-auto" />
							)}
							<div class="p-2 text-xl font-bold">{work.data.title}</div>
							<div class="flex justify-between items-center">
								<a
									href={work.data.url}
									class="font-code text-sky visited:text-purple p-2"
									target="_blank"
									rel="noopener noreferrer"
								>
									{work.data.url}
								</a>
								{work.data.suburl && (
									<a href={work.data.suburl} class="p-2" target="_blank" rel="noopener noreferrer">
										{/^https?:\/\/github\.com\//.test(work.data.suburl) ? (
											<IoLogoGithub size={"1.5rem"} />
										) : (
											<ImLink size={"1.5rem"} />
										)}
									</a>
								)}
							</div>
							<div class="p-2">{work.data.description}</div>
							<ul class="p-2 flex flex-wrap items-center gap-2">
								{work.data.keywords.map((word) => (
									<li class="text-xs font-bold text-muted-foreground bg-muted-background/30 rounded-md">
										{`#${word}`}
									</li>
								))}
							</ul>
						</div>
					</div>
				</Show>
			</Portal>
		</>
	);
};

export default WorkCard;
