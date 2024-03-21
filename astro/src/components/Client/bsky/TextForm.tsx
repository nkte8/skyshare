import { inputtext_base } from "../common/tailwindVariants"
import { Profile_context } from "../common/contexts"
import { useContext } from "react"

const Component = ({
    postText,
    onChange,
    onPaste,
    onfocus = (): void => { },
    onblur = (): void => { },
    disabled
}: {
    postText: string,
    disabled: boolean,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void,
    onfocus?: () => void,
    onblur?: () => void,
}) => {
    const { profile } = useContext(Profile_context)
    const isDesktopEnvironment = new RegExp(/macintosh|windows/).test(navigator.userAgent.toLowerCase())

    return (
        <div className={inputtext_base({
            kind: "outbound",
            disabled: disabled
        })}>
            <div className="flex m-0">
                <div className="flex-none ml-2 mt-2 w-fit">
                    <img src={profile ? profile.avatar : undefined} className="w-12 h-12 inline-block rounded-full bg-sky-400" />
                </div>
                <textarea onChange={onChange}
                    onPaste={onPaste}
                    autoFocus={true}
                    value={postText}
                    onFocus={onfocus}
                    onBlur={onblur}
                    placeholder={
                        `最近どう？いまどうしてる？${isDesktopEnvironment ?
                            "\n*クリップボードからの画像・画像ファイルのペーストが可能です。" : ""
                        }`
                    }
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