import { Dispatch, SetStateAction, useState } from "react"
import deletePage from "@/utils/bskylinx_api/deletePage"
import ProcButton from "../common/procButton"
import { type Session_info, type msgInfo } from "../common/contexts"

const Component = ({
    id,
    session,
    setMsgInfo
}: {
    id: string,
    session: Session_info,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>
}) => {
    const [isProcessing, setProcessing] = useState<boolean>(false)

    const handleClick = async () => {
        setProcessing(true)
        try {
            if (session.did === null || session.accessJwt === null) {
                setMsgInfo({
                    isError: true,
                    msg: "ログインしてください。"
                })
                setProcessing(false)
                return
            }
            const resDeletePage = await deletePage({
                id: id,
                did: session.did,
                accessJwt: session.accessJwt
            })
            if (typeof resDeletePage?.error === "undefined" &&
                resDeletePage.result === "ok") {
                setMsgInfo({
                    isError: false,
                    msg: "ページの削除に成功しました。"
                })
                window.location.reload()
            } else {
                let msg:string = ""
                switch (resDeletePage.error) {
                    case "Unauthorized":
                        msg = "認証に失敗しました。元投稿が削除されていませんか？"
                    default:
                        msg = "Unexpected error"
                }
                setMsgInfo({
                    isError: true,
                    msg: msg
                })
            }
        } catch (e) {
            setMsgInfo({
                isError: true,
                msg: "Unexpected error"
            })
        }
        setProcessing(false)
    }

    return (
        <>
            <ProcButton handler={handleClick}
                isProcessing={isProcessing}
                showAnimation={true}
                context="ページを削除"
                className="bg-red-100 hover:bg-red-300" />
        </>
    )
}
export default Component