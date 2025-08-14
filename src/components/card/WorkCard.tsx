import { type CollectionEntry } from "astro:content";
import { createSignal } from "solid-js";
import { IoLogoGithub } from "solid-icons/io";
import { ImLink } from "solid-icons/im";
import { TbExternalLink } from "solid-icons/tb";

interface Props {
	work: CollectionEntry<"work">;
}

const WorkCard = ({ work }: Props) => {
	const [isOpenCard, setIsOpenCard] = createSignal(false);
	const { title, description, image, keywords, url, suburl } = work.data;

	return (
		<button
			type="button"
			class="hover:opacity-70 transition-opacity duration-200"
			onClick={() => setIsOpenCard(!isOpenCard())}
		>
			<div class="dot-pattern relative w-full flex flex-col border border-muted-background bg-muted-transparent rounded-xl shadow-lg">
				<div class="w-full h-36 overflow-clip rounded-t-xl">
					{image ? (
						<img src={image.src} loading="lazy" class="w-full object-cover object-center" />
					) : (
						<img
							src="/profile-image.jpg"
							loading="lazy"
							class="w-full object-cover object-center grayscale"
						/>
					)}
				</div>
				<div class="w-full border-t border-muted-background h-36">
					<div class="relative w-full">
						{isOpenCard() ? (
							<div class="p-2 absolute w-full">{description}</div>
						) : (
							<div class="p-2 absolute w-full font-bold text-xl tracking-wide">{title}</div>
						)}
					</div>
					<ul class="absolute bottom-1 left-2 flex items-center gap-2">
						<li>
							<a href={url} target="_blank" rel="noopener noreferrer">
								<TbExternalLink size="1.5rem" />
							</a>
						</li>
						{suburl && (
							<li>
								<a href={suburl} target="_blank" rel="noopener noreferrer">
									{/^https?:\/\/github.com\/.*/.test(suburl) ? (
										<IoLogoGithub size="1.5rem" />
									) : (
										<ImLink size="1.5rem" />
									)}
								</a>
							</li>
						)}
					</ul>
					<ul class="absolute bottom-1 right-1 flex items-center gap-2">
						<li>
							{keywords.slice(0, 3).map((word: string) => (
								<span class="p-1 text-xs tracking-tight font-semibold text-muted-foreground">{`# ${word}`}</span>
							))}
						</li>
					</ul>
				</div>
			</div>
		</button>
	);
};

export default WorkCard;
