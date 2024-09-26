import { IoClose, IoSearch } from "solid-icons/io";
import { createSignal } from "solid-js";

const OpenSearchInput = () => {
	const [isOpen, setIsOpen] = createSignal(false);
	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);
	return (
		<button type="button" onMouseEnter={open} onMouseLeave={close}>
			{isOpen() ? <IoClose size="1.2rem" /> : <IoSearch size="1.2rem" />}
		</button>
	);
};

export default OpenSearchInput;
