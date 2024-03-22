// utils
import { Dispatch, SetStateAction, useContext } from "react"

// service
import { inputtext_base } from "../../common/tailwindVariants"
import { Profile_context } from "../../common/contexts"
import { MediaData } from "../../common/types"
import { addImageMediaData } from "../lib/addImageMediaData"
import { callbackTextInputBoxOptions } from "../PostForm"

const Component = ({
    postText,
    mediaData,
    setMediaData,
    callback,
    disabled,
    children,
}: {
    postText: string,
    mediaData: MediaData,
    setMediaData: Dispatch<SetStateAction<MediaData>>,
    callback: (options: callbackTextInputBoxOptions) => void,
    disabled: boolean,
    children?: React.ReactNode,
}) => {
    const { profile } = useContext(Profile_context)
    const isDesktopEnvironment = new RegExp(/macintosh|windows/).test(navigator.userAgent.toLowerCase())

    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        callback({postText: event.target.value})
    }
    /**
     * ペーストイベントを処理します
     * @param e クリップボードイベント
     */
    const handleOnPaste = async (
        e: React.ClipboardEvent<HTMLTextAreaElement>,
    ) => {
        const items: DataTransferItemList = e.clipboardData.items
        if (items.length <= 0) {
            return
        }
        const newImageFiles = collectNewImages(items)
        if (newImageFiles.length <= 0) {
            return
        }
        // NOTE 画像ファイルが含まれている場合は文字列のペーストを抑制
        e.preventDefault()
        await addImageMediaData(newImageFiles, mediaData, setMediaData)
        callback({postText})
    }

    /**
     * データ転送アイテムリストから画像ファイルのリストを作成します
     * @param items データ転送アイテムリスト
     * @returns 画像ファイルのリスト
     */
    const collectNewImages = (items: DataTransferItemList): File[] => {
        const newImageFiles: File[] = []
        for (const item of items) {
            const file: File | null = item.getAsFile()

            if (file != null && file.type.startsWith("image")) {
                newImageFiles.push(file)
            }
        }
        return newImageFiles
    }
    return (
        <div className={inputtext_base({
            kind: "outbound",
            disabled: disabled
        })}>
            <div className="relative">
                <div className="flex m-0">
                    <div className="flex-none ml-2 mt-2 w-fit">
                        <img src={profile ? profile.avatar : undefined} className="w-12 h-12 inline-block rounded-full bg-sky-400" />
                    </div>
                    <textarea
                        onChange={handleOnChange}
                        onPaste={handleOnPaste}
                        autoFocus={true}
                        value={postText}
                        placeholder={
                            `最近どう？いまどうしてる？${isDesktopEnvironment ?
                                "\n*クリップボードからの画像・画像ファイルのペーストが可能です。" : ""
                            }`
                        }
                        disabled={disabled}
                        className={inputtext_base({
                            kind: "inbound",
                            class: "pt-2 w-full md:w-lg resize-y overflow-y-auto h-48 mb-4",
                            disabled: disabled
                        })}
                    />
                    <div className="absolute right-3 bottom-[-15px] z-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Component