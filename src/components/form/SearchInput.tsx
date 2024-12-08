import { IoSearchOutline, IoClose } from "solid-icons/io";
import { keyword, setKeyword } from "../../utils/store/search";

const SearchInput = () => {
	const bind = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		setKeyword(value);
	};

	return (
		<div class="rounded-lg flex items-center bg-muted-background xl:w-[16.4rem]">
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
				class="rounded-r-lg bg-muted-background border-none placeholder:text-muted-foreground w-full h-12 py-1 pr-2 text-lg focus:outline-none focus:ring-0"
				value={keyword()}
				placeholder="Search..."
				onInput={(e) => bind(e)}
			/>
		</div>
	);
};

export default SearchInput;
