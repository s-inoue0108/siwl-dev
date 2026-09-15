import { createEffect, onCleanup, onMount } from "solid-js";
import { Portal, Show } from "solid-js/web";
import {
    isOpenBookcard,
    bookInfo,
    reviewBody,
    setIsOpenBookcard,
    bookRating
} from "../../utils/store/is-open-bookcard";
import { AiOutlineCloseCircle, AiFillStar, AiOutlineStar } from "solid-icons/ai";

const ReadingModal = () => {
    onMount(() => {
        createEffect(() => {
            if (isOpenBookcard()) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        });

        onCleanup(() => {
            document.body.style.overflow = "";
        });
    });

    const close = () => {
        setIsOpenBookcard(false)
    };

    return (
        <Show when={isOpenBookcard()}>
            <Portal mount={document.body}>
                <div class="fixed inset-0 z-[999] bg-muted-background/90">
                    <button type="button" onClick={close} class="absolute top-16 left-1/2 -translate-x-1/2 hover:opacity-50 transition duration-150">
                        <div class="flex items-center gap-2 text-2xl">
                            <AiOutlineCloseCircle />
                            <div>Close</div>
                        </div>
                    </button>
                    <div class="w-full md:w-[768px] px-8 absolute top-48 left-1/2 -translate-x-1/2">
                        <ul class="flex justify-center gap-4">
                            <li>
                                <img src={bookInfo()?.coverUrl} class="w-32 h-48" />
                            </li>
                            <li class="flex flex-col gap-2 max-w-32 md:max-w-96">
                                <h3 class="font-bold md:text-xl">{bookInfo()?.title}</h3>
                                <p class="text-xs md:text-base">{bookInfo()?.author}</p>
                                <div class="flex items-center mt-4">
                                    {Array.from({ length: bookRating() }, (_) => (
                                        <AiFillStar />
                                    ))}
                                    {Array.from({ length: 5 - bookRating() }, (_) => (
                                        <AiOutlineStar />
                                    ))}
                                </div>
                            </li>
                        </ul>
                        <div class="pt-8">
                            {reviewBody()}
                        </div>
                    </div>
                </div>
            </Portal>
        </Show>
    );
};

export default ReadingModal;