import type { JSXElement } from "solid-js";

interface Props {
	children: JSXElement;
	title: string;
}

const MacintoshInterfaceCard = ({ children, title }: Props) => {
	return (
		<section class="px-4 py-2 border border-muted-background bg-muted-transparent w-full rounded-xl flex flex-col gap-2 lg:gap-4 shadow-lg">
			<div class="w-full flex items-center gap-4 2xl:gap-8 border-b border-muted-background pt-1 pb-2">
				<ul class="w-fit flex items-center gap-2">
					<li class="bg-red-500 w-3 h-3 xl:w-4 xl:h-4 rounded-full" />
					<li class="bg-yellow-500 w-3 h-3 xl:w-4 xl:h-4 rounded-full" />
					<li class="bg-green-500 w-3 h-3 xl:w-4 xl:h-4 rounded-full" />
				</ul>
				<div class="font-code font-semibold text-sm xl:text-lg pb-[2px]">{title}</div>
			</div>
			<div>{children}</div>
		</section>
	);
};

export default MacintoshInterfaceCard;
