import { type CollectionEntry } from "astro:content";
import { Portal, Show } from "solid-js/web";
import { createSignal } from "solid-js";
// Swiper
// import { Swiper } from "swiper";
// import "swiper/css/bundle";

interface Props {
	work: CollectionEntry<"work">;
}

const WorkCard = ({ work }: Props) => {
	// const swiper = new Swiper(".swiper", {
	// 	loop: true,

	// 	//ページネーションの設定
	// 	pagination: {
	// 		el: ".swiper-pagination",
	// 	},
	// 	//ナビゲーションボタンの設定
	// 	navigation: {
	// 		nextEl: ".swiper-button-next",
	// 		prevEl: ".swiper-button-prev",
	// 	},
	// 	//スクロールバーの設定
	// 	scrollbar: {
	// 		el: ".swiper-scrollbar",
	// 	},
	// });

	const [isOpenCard, setIsOpenCard] = createSignal(false);

	return (
		<>
			<button
				type="button"
				class="w-96 h-64 flex flex-col border border-muted-background rounded-xl"
				onClick={() => setIsOpenCard(true)}
			>
				<span class="w-full h-40"></span>
				<span class="w-full border-t-[1px] border-muted-background h-24">
					<span>{work.data.title}</span>
				</span>
			</button>
			<Portal mount={document.body}>
				<Show when={isOpenCard()}>
					<div class="z-[100] w-full h-full fixed top-0 left-0 overflow-y-auto bg-background/80">
						{/* <div class="swiper">
							<div class="swiper-wrapper">
								<div class="swiper-slide">
									<img src="画像のパス" />
								</div>
								<div class="swiper-slide">
									<img src="画像のパス" />
								</div>
								<div class="swiper-slide">
									<img src="画像のパス" />
								</div>
								<div class="swiper-slide">
									<img src="画像のパス" />
								</div>
								<div class="swiper-slide">
									<img src="画像のパス" />
								</div>
								<div class="swiper-slide">
									<img src="画像のパス" />
								</div>
							</div>
							<div class="swiper-pagination"></div>

							<div class="swiper-button-prev"></div>
							<div class="swiper-button-next"></div>

							<div class="swiper-scrollbar"></div>
						</div> */}
					</div>
				</Show>
			</Portal>
		</>
	);
};

export default WorkCard;
