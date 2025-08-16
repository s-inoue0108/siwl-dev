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
			title={isOpenCard() ? "Display description" : "Display title"}
			class="relative w-full hover:bg-muted-background border border-muted-background bg-muted-transparent rounded-xl shadow-lg transition duration-200"
			onClick={() => setIsOpenCard(!isOpenCard())}
		>
			<div class="flex flex-col">
				<div class="w-full h-36 rounded-t-xl overflow-clip">
					<img
						src={image ? image.src : "/profile-image.jpg"}
						loading="lazy"
						class="block w-full object-cover"
					/>
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
					<a href={url} target="_blank" rel="noopener noreferrer">
						<TbExternalLink size="1.5rem" />
					</a>
				</li>
				{suburl && (
					<li>
						<a
							class="hover:opacity-70 transition duration-150"
							href={suburl}
							target="_blank"
							rel="noopener noreferrer"
						>
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
		</button>
	);
};

export default WorkCard;
