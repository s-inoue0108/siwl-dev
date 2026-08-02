import { For } from "solid-js";

interface Props {
    data: {
        label: string;
        value: number;
    }[]
}

const InterestBarhCard = ({ data }: Props) => {

    return (
        <For each={data} >
            {(item) => (
                <div class="w-full h-8 flex items-center gap-3 my-2">
                    <div class="w-1/3 font-semibold text-sm lg:text-base text-muted-foreground text-right">{item.label}</div>
                    <div class="flex-1 h-6 bg-muted-background rounded">
                        <div
                            class="h-full rounded-lg bg-gradient-to-r from-accent-sub-base to-accent-base"
                            style={{
                                width: `${item.value}%`,
                            }}
                        />
                    </div>
                    <div class="font-code text-lg text-muted-foreground">{item.value}</div>
                </div>
            )}
        </For >
    )
}

export default InterestBarhCard;
