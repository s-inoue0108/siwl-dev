import type { MarkdownHeading } from "astro";
import Panel from "./Panel";
import { createSignal, createEffect, createMemo, onMount, For } from "solid-js";

interface Props {
	headings: MarkdownHeading[];
}

const Toc = ({ headings }: Props) => {
	const [scrollHeight, setScrollHeight] = createSignal(0);
	const [offsets, setOffsets] = createSignal<number[]>([]);

	const offsetBoundaries = createMemo(() => {
		return offsets().map((offset, idx, arr) => {
			return {
				top: offset,
				bottom: arr[idx + 1] ?? document.body.scrollHeight,
			};
		});
	});

	const headingWithIsActives = createMemo(() => {
		return offsetBoundaries().map((b, idx) => {
			return {
				...headings[idx],
				isActive: scrollHeight() >= b.top && scrollHeight() < b.bottom,
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

	return (
		<Panel
			title="Contents"
			href="#"
			Content={
				<ul class="flex flex-col gap-2 max-h-[60dvh] overflow-y-auto toc-scrollbar">
					<For
						each={headingWithIsActives()}
						fallback={<div class="text-center font-semibold text-muted-foreground">Loading...</div>}
					>
						{(h) => {
							return (
								<li class="border-b-[0.5px] sm:border-0 border-muted-background">
									<a
										href={`#h${h.depth}-${encodeURIComponent(h.text.replace(/#/g, ""))}`}
										class={`${
											h.isActive
												? "bg-gradient-to-b from-accent-sub-base to-accent-base bg-clip-text text-transparent"
												: "text-muted-foreground"
										} ${
											h.depth === 2 ? "" : h.depth === 3 ? "pl-4" : "pl-8"
										} hover:text-foreground inline-flex items-center gap-2`}
									>
										<span
											class={`${
												h.isActive
													? "bg-gradient-to-b from-accent-sub-base to-accent-base"
													: "bg-muted-foreground"
											} w-[0.375rem] h-[0.375rem] rounded-full`}
										/>
										<span
											class={`${
												h.depth === 2
													? "text-lg font-bold"
													: h.depth === 3
													? "text-base font-semibold"
													: "text-sm font-semibold"
											}`}
										>
											{h.text.replace(/#/g, "")}
										</span>
									</a>
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
