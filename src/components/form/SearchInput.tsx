import { onCleanup } from "solid-js";
import { IoSearchOutline, IoClose } from "solid-icons/io";
import { keyword, setKeyword, setIsOpenSearchModal } from "../../utils/store/search";

const SearchInput = () => {
	const bind = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		setKeyword(value);
	};

	onCleanup(() => {
		setKeyword("");
		setIsOpenSearchModal(false);
	});

	return (
		<div class="flex items-center bg-muted-background rounded-lg">
			<label class="relative w-12 h-12">
				<button
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground text-lg"
					onClick={() => setKeyword("")}
				>
					{keyword() === "" ? <IoSearchOutline /> : <IoClose />}
				</button>
			</label>
			<input
				type="text"
				class="placeholder:text-muted-foreground h-12 py-1 pr-2 text-lg focus:outline-none"
				value={keyword()}
				placeholder="Search..."
				onInput={(e) => bind(e)}
			/>
		</div>
	);
};

export default SearchInput;
