import type { MarkdownHeading } from "astro";
import Panel from "./Panel";
import { createSignal, Switch, Match, createEffect, createMemo, onMount, For } from "solid-js";

interface Props {
	headings: MarkdownHeading[];
}

const Toc = ({ headings }: Props) => {
	const [scrollHeight, setScrollHeight] = createSignal(0);
	const [offsets, setOffsets] = createSignal<number[]>([]);

	const headingWithOffsets = createMemo<
		{
			heading: MarkdownHeading;
			offsets: {
				start: number;
				end: number;
			};
		}[]
	>(() => {
		return offsets().map((offset, idx, arr) => {
			return {
				heading: headings[idx],
				offsets: {
					start: offset,
					end: arr[idx + 1] ?? document.body.scrollHeight,
				},
			};
		});
	});

	onMount(() => {
		const headingOffsets = headings.map(({ text, depth }) => {
			return document.getElementById(`h${depth}-${text.replace(/#/g, "")}`)?.offsetTop ?? 0;
		});
		setOffsets(headingOffsets);
	});

	createEffect(() => {
		window.addEventListener("scroll", () => {
			setScrollHeight(window.scrollY);
		});

		window.addEventListener("resize", () => {
			const headingOffsets = headings.map(({ text, depth }) => {
				return document.getElementById(`h${depth}-${text.replace(/#/g, "")}`)?.offsetTop ?? 0;
			});
			setOffsets(headingOffsets);
		});

		document.addEventListener("resize", () => {
			const headingOffsets = headings.map(({ text, depth }) => {
				return document.getElementById(`h${depth}-${text.replace(/#/g, "")}`)?.offsetTop ?? 0;
			});
			setOffsets(headingOffsets);
		});
	});

	const isBetween = (start: number, end: number) => {
		return scrollHeight() >= start && scrollHeight() < end;
	};

	return (
		<Panel
			title="Contents"
			href="#"
			Content={
				<ul class="flex flex-col gap-2">
					<For
						each={headingWithOffsets()}
						fallback={<div class="text-center font-semibold text-muted-foreground">Loading...</div>}
					>
						{({ heading, offsets }) => {
							const { text, depth } = heading;
							const { start, end } = offsets;
							return (
								<li class={`border-b-[0.5px] border-muted-background`}>
									<Switch>
										<Match when={depth === 1}>
											<a
												href={`#h1-${encodeURIComponent(text.replace(/#/g, ""))}`}
												class={`${
													isBetween(start, end) && "opacity-100"
												} inline-flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-150`}
											>
												<span class="bg-gradient-to-r from-accent-sub-base to-accent-base w-3 h-[0.125rem]" />
												<span class="font-bold text-lg">{text.replace(/#/g, "")}</span>
											</a>
										</Match>
										<Match when={depth === 2}>
											<a
												href={`#h2-${encodeURIComponent(text.replace(/#/g, ""))}`}
												class={`${
													isBetween(start, end) && "opacity-100"
												} inline-flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-150 pl-4`}
											>
												<span class="bg-gradient-to-r from-accent-sub-base to-accent-base w-[0.375rem] h-[0.375rem] rounded-full" />
												<span class="font-medium">{text.replace(/#/g, "")}</span>
											</a>
										</Match>
										<Match when={depth > 2}>
											<a
												href={`#h3-${encodeURIComponent(text.replace(/#/g, ""))}`}
												class={`${
													isBetween(start, end) && "opacity-100"
												} inline-flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacitys duration-150 pl-8`}
											>
												<span class="bg-gradient-to-r from-accent-sub-base to-accent-base w-1 h-1 rounded-full" />
												<span class="font-medium text-sm">{text.replace(/#/g, "")}</span>
											</a>
										</Match>
									</Switch>
								</li>
							);
						}}
					</For>
				</ul>
			}
		/>
	);
};

export default Toc;
