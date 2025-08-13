import type { JSXElement } from "solid-js";

interface Props {
	children: JSXElement;
	contentType: string;
	title: string;
	description: string;
}

const MacintoshInterfaceCard = ({ children, contentType, title, description }: Props) => {
	return (
		<section class="p-2 border border-muted-background bg-muted-transparent w-full rounded-xl flex flex-col gap-2 lg:gap-4 shadow-lg">
			<div class="w-full flex gap-8 border-b border-muted-background pb-2">
				<ul class="w-fit flex gap-2 pt-1">
					<li class="bg-red-500 w-3 h-3 rounded-full" />
					<li class="bg-yellow-500 w-3 h-3 rounded-full" />
					<li class="bg-green-500 w-3 h-3 rounded-full" />
				</ul>
				<div class="font-code font-semibold text-sm">$ cat {contentType}.dat</div>
			</div>
			<div class="flex items-center gap-4">
				{children}
				<h2 class="w-[calc(100%-4rem)] font-bold text-lg lg:text-xl xl:text-2xl">{title}</h2>
			</div>
			<p class="text-muted-foreground">{description}</p>
		</section>
	);
};

export default MacintoshInterfaceCard;
