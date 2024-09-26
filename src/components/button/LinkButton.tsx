import type { JSXElement } from "solid-js";

interface Props {
	href: string;
	isExternal?: boolean;
	Icon: JSXElement;
	isBorder?: boolean;
}

const LinkButton = ({ href, isExternal = false, Icon, isBorder = false }: Props) => {
	return (
		<a
			href={href}
			target={isExternal ? "_blank" : "_self"}
			rel={isExternal ? "noopener noreferrer" : undefined}
			class={`${isBorder && "p-1 border-[1px] border-muted-foreground rounded-md"}`}
		>
			{Icon}
		</a>
	);
};

export default LinkButton;
