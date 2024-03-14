import { inputtext_base } from "../common/tailwind_variants"
import { Profile_context } from "../common/contexts"
import { useContext } from "react"

const Component = ({
    post,
    onChange,
    onPaste,
    onfocus = (): void => { },
    onblur = (): void => { },
    disabled
}: {
    post: string,
    disabled: boolean,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void,
    onfocus?: () => void,
    onblur?: () => void,
}) => {
    const { profile } = useContext(Profile_context)
    return (
        <div className={inputtext_base({
            kind: "outbound",
            disabled: disabled
        })}>
            <div className="flex m-0">
                <div className="flex-none ml-2 mt-2 w-fit">
                    <img src={profile?.avatar} className="w-12 h-12 inline-block rounded-full" />
                </div>
                <textarea onChange={onChange}
                    onPaste={onPaste}
                    autoFocus={true}
                    value={post}
                    onFocus={onfocus}
                    onBlur={onblur}
                    placeholder="最近どう？いまどうしてる？"
                    disabled={disabled}
                    className={inputtext_base({
                        kind: "inbound",
                        class: "pt-2 w-full md:w-lg resize-y overflow-y-auto h-48",
                        disabled: disabled
                    })}
                />

            </div>
        </div>
    )
}
export default Component