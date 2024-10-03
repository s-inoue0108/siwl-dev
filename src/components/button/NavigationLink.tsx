import { TbExternalLink } from "solid-icons/tb";

interface Props {
	name: string;
	href: string;
	isExternal?: boolean;
	isReload?: boolean;
	isCurrent: boolean;
}

const NavigationLink = ({ name, href, isExternal = false, isReload = false, isCurrent }: Props) => {
	return isReload ? (
		<a
			href={href}
			target={isExternal ? "_blank" : "_self"}
			rel={isExternal ? "noopener noreferrer" : undefined}
			class={`${
				isCurrent ? "bg-gradient-to-r from-accent-sub-base to-accent-base" : "bg-transparent"
			} hover:bg-muted-background transition duration-150 px-3 py-2 rounded-full`}
			data-astro-reload
		>
			<span class={`inline-flex items-center gap-1`}>
				<span class={`text-xl ${isCurrent ? "font-bold" : "font-medium"}`}>{name}</span>
				{isExternal && <TbExternalLink />}
			</span>
		</a>
	) : (
		<a
			href={href}
			target={isExternal ? "_blank" : "_self"}
			rel={isExternal ? "noopener noreferrer" : undefined}
			class={`${
				isCurrent ? "bg-gradient-to-r from-accent-sub-base to-accent-base" : "bg-transparent"
			} hover:bg-muted-background transition duration-150 px-3 py-2 rounded-full`}
		>
			<span class={`inline-flex items-center gap-1`}>
				<span class={`text-xl ${isCurrent ? "font-bold" : "font-medium"}`}>{name}</span>
				{isExternal && <TbExternalLink />}
			</span>
		</a>
	);
};

export default NavigationLink;
