import type { BookInfo } from "../../utils/api/get-book-info";
import { setIsOpenBookcard, setBookInfo, setReviewBody, setBookRating } from "../../utils/store/is-open-bookcard";
import { AiFillStar, AiOutlineStar } from "solid-icons/ai";

interface Props {
	rating: number;
	bookInfo: BookInfo | null;
	body: string;
}

const ReadingCard = ({ rating, bookInfo, body }: Props) => {
	const open = () => {
		setBookInfo(bookInfo)
		setBookRating(rating)
		setReviewBody(body)
		setIsOpenBookcard(true)
	};

	return (
		<button
			type="button"
			onClick={open}
			class="rounded-lg shadow-xl dark:shadow-white/20 transition-all duration-150 hover:translate-y-[4px]"
		>
			<div class="relative">
				<img src={bookInfo?.coverUrl} alt={bookInfo?.title} />
				<div class="absolute left-1/2 -translate-x-1/2 bottom-0 flex justify-center bg-muted-background/50 py-1 w-full">
					{Array.from({ length: rating }, (_) => (
						<AiFillStar />
					))}
					{Array.from({ length: 5 - rating }, (_) => (
						<AiOutlineStar />
					))}
				</div>
			</div>
		</button>
	);
};

export default ReadingCard;
