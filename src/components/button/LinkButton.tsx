import type { Component } from "solid-js";

interface Props {
	href: string;
	isExternal?: boolean;
	Icon: Component;
	isBorder?: boolean;
}

const LinkButton = ({ href, isExternal = false, Icon, isBorder = false }: Props) => {
	return (
		<div class={`${isBorder && "p-1 border-[1px] border-muted-foreground rounded-md"}`}>
			<a
				href={href}
				target={isExternal ? "_blank" : "_self"}
				rel={isExternal ? "noopener noreferrer" : undefined}
			>
				<Icon />
			</a>
		</div>
	);
};

export default LinkButton;
