import { Dispatch, SetStateAction, useState } from "react"
import deletePage from "@/utils/backend_api/deletePage"
import ProcButton from "../common/ProcButton"
import { type Session_info } from "../common/contexts"
import { type msgInfo } from "../common/types"

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
                let e: Error = new Error("フロントエンドが想定していない操作が行われました。")
                e.name = "Unexpected Error@pagedelete.tsx"
                throw e
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
                    msg: "ページを削除しました!"
                })
                window.location.reload()
            } else {
                let e: Error = new Error(resDeletePage.message)
                e.name = "pagedelete.tsx"
                throw e
            }
        } catch (error: unknown) {
            let msg: string = "Unexpected Unknown Error"
            if(error instanceof Error) {
                msg = error.name + ": " + error.message
            }
            setMsgInfo({
                msg: msg,
                isError: true
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