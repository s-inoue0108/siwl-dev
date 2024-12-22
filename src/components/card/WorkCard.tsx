import { type CollectionEntry } from "astro:content";
import { Portal, Show } from "solid-js/web";
import { createSignal } from "solid-js";
import { IoCloseCircleOutline, IoLogoGithub } from "solid-icons/io";

interface Props {
	work: CollectionEntry<"work">;
}

const WorkCard = ({ work }: Props) => {
	const [isOpenCard, setIsOpenCard] = createSignal(false);

	return (
		<>
			<button
				type="button"
				class="relative w-full lg:w-96 h-64 flex flex-col border border-muted-background bg-muted-background/30 rounded-xl"
				onClick={() => setIsOpenCard(true)}
			>
				<span class="w-full h-40">
					<img
						src={work.data.image.src}
						loading="lazy"
						class="rounded-t-xl object-cover w-full h-full"
					/>
				</span>
				<span class="px-2 py-4 w-full border-t border-muted-background h-24">
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
							<img src={work.data.image.src} loading="lazy" class="w-full" />
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
								<a href={work.data.github} class="p-2" target="_blank" rel="noopener noreferrer">
									<IoLogoGithub size={"1.5rem"} />
								</a>
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
