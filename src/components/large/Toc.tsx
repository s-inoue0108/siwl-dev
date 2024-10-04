import type { MarkdownHeading } from "astro";
import Panel from "./Panel";

interface Props {
	headings: MarkdownHeading[];
}

const Toc = ({ headings }: Props) => {
	return (
		<Panel
			title="Contents"
			href="#"
			Content={
				<ul class="flex flex-col">
					{headings.map(({ text, slug, depth }) => (
						<li class={``}>
							<a href={`#${slug}`} class={`inline-flex items-center gap-1`}>
								<span class="bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent">
									{"#".repeat(depth)}
								</span>
								{text}
							</a>
						</li>
					))}
				</ul>
			}
		/>
	);
};

export default Toc;
