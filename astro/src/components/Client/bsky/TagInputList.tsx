
import { Dispatch, SetStateAction } from "react";
import { button_base } from "../common/tailwind_variants";
import { readSavedTags } from "@/utils/localstorage";

export const Component = ({
    disabled,
    post,
    setPost
}: {
    disabled: boolean,
    post: string,
    setPost: Dispatch<SetStateAction<string>>
}) => {
    const handleClick = (tag: string) => {
        const newText = post + ` ${tag}`
        setPost(newText)
    }
    const TagButton = ({ tag }: { tag: string }) => {
        return (
            <button
                onClick={() => { handleClick(tag) }}
                className={button_base({
                    disabled: disabled,
                    class: [
                        "rounded-lg",
                        "my-auto",
                        "text-sm",
                        "py-0",
                        "px-3",
                        "w-fit",
                        "inline-block",
                        "whitespace-nowrap"
                    ],
                    noshadow: true
                })}>
                {tag}
            </button>
        )
    }
    return (
        <div className="my-auto overflow-x-scroll flex w-fit minimum-scrollbars">
            {
                readSavedTags()?.map((value) => {
                    return <TagButton tag={value} />
                })
            }
        </div>
    )

}
export default Component