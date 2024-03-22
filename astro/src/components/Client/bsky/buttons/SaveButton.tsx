// utils
import { Dispatch, SetStateAction } from "react"

// components
import ProcButton from "../../common/ProcButton"

// backend api
import { richTextFacetParser } from "@/utils/richTextParser"

// service
import { setSavedTags, readSavedTags, saveDrafts, readDrafts } from "@/utils/useLocalStorage";
import { msgInfo } from "../../common/types"


export const Component = ({
    postText,
    setPostText,
    setDrafts,
    isProcessing,
    setProcessing,
    setMsgInfo,
    disabled,
}: {
    postText: string,
    setPostText: Dispatch<SetStateAction<string>>,
    setDrafts: Dispatch<SetStateAction<string[] | null>>,
    isProcessing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
    disabled: boolean
}) => {
    // 保存できるタグの上限
    const maxTagCount = 8

    const handleSavePost = () => {
        const isValidPost = (): boolean => {
            let result: boolean = postText.length >= 1
            return result
        }

        if (!isValidPost()) {
            setMsgInfo({
                msg: "ポスト本文が存在しません。",
                isError: true
            })
            return
        }

        const initializePost = () => {
            setProcessing(true)
            // Postを押したら強制的にフォーカスアウトイベントを発火
        }
        
        initializePost()

        try {
            // Hashtagが含まれている場合はブラウザに保存
            const richTextLinkParser = new richTextFacetParser("tag")
            const parseResult = richTextLinkParser.getFacet(postText)

            const savedTag = readSavedTags()
            
            let taglist: string[] = (savedTag !== null) ? savedTag : []
            parseResult.forEach((value) => {
                const tagName = value
                const tagIndex = taglist.indexOf(tagName)
                if (tagIndex < 0) {
                    // タグが存在しない場合は先頭に追加
                    taglist.unshift(tagName)
                } else {
                    // タグが存在する場合は先頭に移動
                    taglist.splice(tagIndex, 1)
                    taglist.unshift(tagName)
                }
            })

            setSavedTags(taglist.slice(0, maxTagCount))
        } catch (error: unknown) {
            let msg: string = "Unexpected Unknown Error"
            if (error instanceof Error) {
                msg = error.name + ": " + error.message
            }
            setMsgInfo({
                msg: msg,
                isError: true
            })
        }

        const newDrafts = [postText, ...readDrafts() || []]

        saveDrafts(newDrafts)
        setDrafts(newDrafts)

        setPostText("")
        
        setProcessing(false)

        setMsgInfo({
          msg: "下書きを保存しました。",
          isError: false
        })
    }

    return (
        <ProcButton
            buttonID="post"
            handler={handleSavePost}
            isProcessing={isProcessing}
            context={<span className={[
                "my-auto"
            ].join(" ")}>
                保存
            </span>}
            color="blue"
            className={["my-0", "py-0.5", "align-middle"]}
            disabled={disabled} />
    )
}
export default Component