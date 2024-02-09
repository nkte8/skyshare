import { inputtext_base } from "../common/tailwind_variants"

const Component = ({ post, onChange, onfocus, onblur, disabled }: {
    post: string,
    disabled: boolean,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onfocus: () => void,
    onblur: () => void,
}) => {
    return (
        <div>
            <textarea onChange={onChange}
                value={post}
                onFocus={onfocus}
                onBlur={onblur}
                placeholder="最近どう？いまどうしてる？"
                disabled={disabled}
                className={inputtext_base({
                     class: "px-3 py-1 rounded-lg mt-1 md-1 mr-1 w-full h-32 md:w-lg resize-y",
                     disabled: disabled })} />
        </div>
    )
}
export default Component