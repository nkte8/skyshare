// utils
import { Dispatch, SetStateAction, useContext } from "react"
import twitterText from 'twitter-text';

// service
import { inputtext_base } from "../../common/tailwindVariants"
import { Profile_context } from "../../common/contexts"
import { MediaData } from "../../common/types"
import { addImageMediaData } from "../lib/addImageMediaData"

const Component = ({
    postText,
    setPostText,
    mediaData,
    setMediaData,
    disabled,
}: {
    postText: string,
    setPostText: Dispatch<SetStateAction<string>>,
    mediaData: MediaData,
    setMediaData: Dispatch<SetStateAction<MediaData>>,
    disabled: boolean,
}) => {
    // Postの入力上限 (Bsky)
    const countMax = 300
    // PostのWarining上限 （= Xの入力上限）
    const countWarn = 140

    const { profile } = useContext(Profile_context)
    const isDesktopEnvironment = new RegExp(/macintosh|windows/).test(navigator.userAgent.toLowerCase())

    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostText(event.target.value)
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

    /**
     * X での文字数カウントを返します（端数切り上げ）
     * @returns 文字数
     */
    const textCountOnX = (): number => {
        return Math.ceil(twitterText.parseTweet(postText).weightedLength / 2)
    }

    /**
     * bluesky での文字数カウントを返却
     * @returns 文字数
     */
    const textCount = (): number => {
        try {
            const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'grapheme' })
            const segments = segmenterJa.segment(postText)
            return Array.from(segments).length
        } catch (e) {
            // Intl.Segmenterがfirefoxでは未対応であるため、やむをえずレガシーな方法で対処
            // 絵文字のカウント数が想定より多く設定されてしまうため、firefox_v125までは非推奨ブラウザとする
            return postText.length
        }
    }

    return (
        <div className={inputtext_base({
            kind: "outbound",
            disabled: disabled,
            class: "relative"
        })}>
            {/* Icon/Textboxのエリア */}
            <div className="flex m-0 mb-8">
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
                        class: [
                            "mt-1", "py-0", "w-full", "md:w-lg",
                            "resize-y", "overflow-y-auto",
                            "h-48", "mb-0", "flex-1"],
                        disabled: disabled
                    })}
                />
            </div>
            {/* positionによる自由配置要素 */}
            <div className={[
                "absolute", "rounded-lg",
                "opacity-75", "text-sm",
                "px-2", "m-0", "bottom-1", "right-1",
                "w-fit", "flex", "text-right"].join(" ") +
                ` ${(textCount() > countMax) ? "bg-red-300" : ""}${(
                    textCountOnX() > countWarn &&
                    textCount() <= countMax) ? "bg-amber-300" : ""}`}>
                <span className={
                    ["w-fit",
                    ].join(" ")}>
                    {`${textCountOnX()}/${countMax} (X)`}
                </span>
                {/* ガタガタさせないように固定長 */}
                <span className={["w-36"].join(" ")}>
                    {`${textCount()}/${countMax} (Bluesky)`}
                </span>
            </div>
        </div>
    )
}
export default Component