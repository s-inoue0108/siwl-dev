import type { MarkdownHeading } from "astro";
import Panel from "./Panel";
import { Switch, Match } from "solid-js";

interface Props {
	headings: MarkdownHeading[];
}

const Toc = ({ headings }: Props) => {
	return (
		<Panel
			title="Contents"
			href="#"
			Content={
				<ul class="flex flex-col gap-2">
					{headings.map(({ text, depth }) => (
						<li class={`border-b-[0.5px] border-muted-background`}>
							<Switch>
								<Match when={depth === 1}>
									<a
										href={`#h1-${encodeURIComponent(text)}`}
										class={`inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150`}
									>
										<span class="bg-gradient-to-r from-accent-sub-base to-accent-base w-3 h-[0.125rem]" />
										<span class="font-semibold text-lg">{text}</span>
									</a>
								</Match>
								<Match when={depth === 2}>
									<a
										href={`#h2-${encodeURIComponent(text)}`}
										class={`inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150 pl-4`}
									>
										<span class="bg-gradient-to-r from-accent-sub-base to-accent-base w-[0.375rem] h-[0.375rem] rounded-full" />
										<span>{text}</span>
									</a>
								</Match>
								<Match when={depth > 2}>
									<a
										href={`#h3-${encodeURIComponent(text)}`}
										class={`inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-150 pl-8`}
									>
										<span class="bg-gradient-to-r from-accent-sub-base to-accent-base w-1 h-1 rounded-full" />
										<span class="text-sm">{text}</span>
									</a>
								</Match>
							</Switch>
						</li>
					))}
				</ul>
			}
		/>
	);
};

export default Toc;
