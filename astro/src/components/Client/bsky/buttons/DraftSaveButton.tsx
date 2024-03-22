// utils
import { Dispatch, SetStateAction } from "react"

// components
import ProcButton from "../../common/ProcButton"

// service
import { saveDrafts, readDrafts } from "@/utils/useLocalStorage";
import { msgInfo } from "../../common/types"
import saveTagToSavedTags from "../lib/saveTagList";

export const Component = ({
    postText,
    setPostText,
    setDrafts,
    isProcessing,
    setProcessing,
    setMsgInfo,
}: {
    postText: string,
    setPostText: Dispatch<SetStateAction<string>>,
    setDrafts: Dispatch<SetStateAction<string[] | null>>,
    isProcessing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
}) => {

    /**
     * 下書きとして保存可能かどうかを判定します
     * @returns ポスト可能な場合true
     */
    const isValidDraft = () => postText.length >= 1


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
        saveTagToSavedTags({ postText })

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
            disabled={!isValidDraft()} />
    )
}
export default Component