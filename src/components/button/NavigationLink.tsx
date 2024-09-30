import { TbExternalLink } from "solid-icons/tb";

interface Props {
	name: string;
	href: string;
	isExternal?: boolean;
	isCurrent: boolean;
}

const NavigationLink = ({ name, href, isExternal = false, isCurrent }: Props) => {
	return (
		<a
			href={href}
			target={isExternal ? "_blank" : "_self"}
			rel={isExternal ? "noopener noreferrer" : undefined}
			class="hover:bg-muted-background transition-colors duration-150 px-3 py-2 rounded-xl"
		>
			<span
				class={`inline-flex items-center gap-1 pt-3 pb-2 border-b-4 ${
					isCurrent ? "border-accent-base" : "border-background"
				}`}
			>
				<span class="text-xl font-medium">{name}</span>
				{isExternal && <TbExternalLink />}
			</span>
		</a>
	);
};

export default NavigationLink;
