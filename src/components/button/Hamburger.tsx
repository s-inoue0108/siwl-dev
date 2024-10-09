import { IoMenu, IoClose } from "solid-icons/io";
import { onCleanup } from "solid-js";
import { isOpenSidebar, setIsOpenSidebar } from "../../utils/store/isOpenSidebar";
import { backfaceFixed } from "../../utils/common/utilfuncs";

interface Props {
	size?: string | number;
	isBorder?: boolean;
}

const Hamburger = ({ size = "1.4rem", isBorder = false }: Props) => {
	const toggleOpen = () => {
		const header = document.getElementById("header")!;
		const content = document.getElementById("content")!;

		if (isOpenSidebar()) {
			backfaceFixed(false);
			header.style.opacity = "1";
			header.style.pointerEvents = "auto";
			header.style.userSelect = "auto";
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
		} else {
			backfaceFixed(true);
			header.style.opacity = "0.2";
			header.style.pointerEvents = "none";
			header.style.userSelect = "none";
			content.style.opacity = "0.2";
			content.style.pointerEvents = "none";
			content.style.userSelect = "none";
		}
		setIsOpenSidebar(!isOpenSidebar());
	};

	onCleanup(() => {
		setIsOpenSidebar(false);
	});

	return (
		<button
			type="button"
			onClick={toggleOpen}
			class={`${
				isBorder &&
				`p-[0.375rem] border border-muted-foreground rounded-md transition-colors duration-200 hover:bg-foreground hover:border-foreground hover:text-muted-background ${
					isOpenSidebar() && "bg-foreground text-muted-background"
				}`
			}`}
		>
			{isOpenSidebar() ? <IoClose size={size} /> : <IoMenu size={size} />}
		</button>
	);
};

export default Hamburger;
