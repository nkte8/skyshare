import { Dispatch, SetStateAction } from "react"
import { inputtext_base } from "../common/tailwind_variants"

const Component = ({ post, onChange, onfocus, onblur }: {
    post: string
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onfocus: () => void,
    onblur: () => void,
}) => {
    return (
        <div>
            <textarea onChange={onChange}
                value={post}
                maxLength={300}
                onFocus={onfocus}
                onBlur={onblur}
                placeholder="最近どう？いまどうしてる？"
                className={inputtext_base({ class: "px-3 py-1 rounded-lg mt-1 md-1 mr-1 w-full h-32 md:w-lg resize-y text-xl md:text-lg" })} />
        </div>
    )
}
export default Component