import type { JSXElement } from "solid-js";

interface Props {
	children: JSXElement;
	title: string;
}

const MacintoshInterfaceCard = ({ children, title }: Props) => {
	return (
		<section class="px-4 py-2 border border-muted-background bg-muted-transparent w-full rounded-xl flex flex-col gap-2 lg:gap-4 shadow-lg">
			<div class="w-full flex gap-8 border-b border-muted-background pb-2">
				<ul class="w-fit flex gap-2 pt-1">
					<li class="bg-red-500 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 rounded-full" />
					<li class="bg-yellow-500 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 rounded-full" />
					<li class="bg-green-500 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 rounded-full" />
				</ul>
				<div class="font-code font-semibold text-sm lg:text-base xl:text-lg">{title}</div>
			</div>
			<div>{children}</div>
		</section>
	);
};

export default MacintoshInterfaceCard;
