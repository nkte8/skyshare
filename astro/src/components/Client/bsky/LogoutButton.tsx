import { useState, useContext, Dispatch, SetStateAction } from "react"
import { Session_context } from "../common/contexts"
import { type msgInfo } from "../common/types"
import deleteSession from "@/utils/atproto_api/deleteSession";
import { resetJwt, resetLoginInfo } from "@/utils/localstorage";
import ProcButton from "../common/ProcButton"

export const Component = ({
    className,
    setMsgInfo,
    reload,
    processing,
    setProcessing
}: {
    className?: string,
    setMsgInfo?: Dispatch<SetStateAction<msgInfo>>,
    reload: boolean
    processing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>
}) => {
    const { session, setSession } = useContext(Session_context)
    const [loading, setLoad] = useState<boolean>(false)
    const handleLogout = async () => {
        setProcessing(true)
        setLoad(true)
        try {
            if (session.refreshJwt === null) {
                return
            }
            resetJwt()
            resetLoginInfo()
            setSession({
                did: null,
                accessJwt: null,
                refreshJwt: null,
                handle: null,
            })
            await deleteSession({
                refreshJwt: session.refreshJwt
            })
            if (setMsgInfo !== undefined) {
                setMsgInfo({
                    msg: "ログアウトしました!",
                    isError: false,
                })
            }
        } catch (error: unknown) {
            let msg: string = "Unexpected Unknown Error"
            if(error instanceof Error) {
                msg = error.name + ": " + error.message
            }
            if (setMsgInfo !== undefined) {
                setMsgInfo({
                    msg: msg,
                    isError: true
                })
            }
        }
        setProcessing(false)
        setLoad(false)
        if (reload) {
            window.location.reload()
        }
    }

    return (
        <ProcButton
            handler={handleLogout}
            isProcessing={processing}
            context="ログアウト"
            showAnimation={loading}
            className={className} />
    )
}

export default Component
