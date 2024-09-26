import { IoMenu, IoClose } from "solid-icons/io";
import { isOpenMenu, setIsOpenMenu } from "../../utils/store/isOpenMenu";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";

interface Props {
	size?: string | number;
	isBorder?: boolean;
}

const Hamburger = ({ size = "1.2rem", isBorder = false }: Props) => {
	const toggleOpen = () => {
		const content = document.getElementById("content")!;
		if (isOpenMenu()) {
			enableBodyScroll(content);
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
		} else {
			disableBodyScroll(content, { reserveScrollBarGap: true });
			content.style.opacity = "0.2";
			content.style.pointerEvents = "none";
			content.style.userSelect = "none";
		}
		setIsOpenMenu(!isOpenMenu());
	};
	return (
		<button
			type="button"
			onClick={toggleOpen}
			class={`${
				isBorder &&
				"p-[0.375rem] border-[1px] border-muted-foreground rounded-md transition hover:bg-accent-foreground hover:border-accent-foreground"
			} ${isOpenMenu() && "bg-accent-foreground border-0"}`}
		>
			{isOpenMenu() ? <IoClose size={size} /> : <IoMenu size={size} />}
		</button>
	);
};

export default Hamburger;
