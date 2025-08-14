import { For } from "solid-js";
import type { IconTypes } from "solid-icons";
import MacintoshInterfaceCard from "./MacintoshInterfaceCard";

interface Props {
	data: {
		type: string;
		title: {
			text: string;
			icon: IconTypes;
		};
		description: string;
		skills: {
			icon: IconTypes;
			link: string;
			subText?: string;
		}[];
	};
}

const ProfileContentCard = ({ data }: Props) => {
	const { type, title, description, skills } = data;

	return (
		<MacintoshInterfaceCard title={`$ cat ${type}.dat`}>
			<div class="relative w-full h-[240px] sm:h-[208px] lg:h-[320px] 2xl:h-[256px]">
				<div class="flex items-center gap-4">
					{title.icon({ size: "2rem" })}
					<h3 class="font-bold text-lg lg:text-xl xl:text-2xl">{title.text}</h3>
				</div>
				<div class="tracking-wide leading-relaxed sm:text-[1.125rem] lg:text-[1.25rem] mt-4 text-muted-foreground">
					{description}
				</div>
				<div class="w-full absolute bottom-2 bg-muted-background rounded-lg px-3 pt-2 pb-[2px]">
					<ul class="w-full h-fit text-2xl flex items-center gap-3">
						<For each={skills}>
							{({ link, icon, subText }) => (
								<li>
									<a
										class="text-muted-foreground hover:text-foreground transition duration-150"
										href={link}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span class="inline-flex items-center gap-2">
											{icon({ size: "1.5rem" })}
											{subText && <span class="text-sm font-bold">{subText}</span>}
										</span>
									</a>
								</li>
							)}
						</For>
					</ul>
				</div>
			</div>
		</MacintoshInterfaceCard>
	);
};

export default ProfileContentCard;
