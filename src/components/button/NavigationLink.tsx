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
				class={`inline-flex items-center gap-1 pb-1 ${
					isCurrent ? "bg-gradient-to-r from-accent-sub-base to-accent-base" : "bg-background"
				}`}
			>
				<span class="text-xl font-medium bg-background">{name}</span>
				{isExternal && <TbExternalLink />}
			</span>
		</a>
	);
};

export default NavigationLink;
