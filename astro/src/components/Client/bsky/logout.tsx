import { useState, useContext, Dispatch, SetStateAction } from "react"
import { Session_context, type msgInfo } from "../common/contexts"
import deleteSession from "@/utils/atproto_api/deleteSession";
import { reset_Jwt } from "@/utils/localstorage";
import ProcButton from "../common/procButton"

export const Component = ({
    className,
    setMsgInfo,
    reload
}: {
    className?: string,
    setMsgInfo?: Dispatch<SetStateAction<msgInfo>>,
    reload: boolean
}) => {
    const [loading, setLoad] = useState<boolean>(false)
    const { session, setSession } = useContext(Session_context)

    const handleLogout = async () => {
        setLoad(true)
        try {
            if (session.refreshJwt === null) {
                return
            }
            await deleteSession({
                refreshJwt: session.refreshJwt
            })
            setSession({
                did: null,
                accessJwt: null,
                refreshJwt: null,
                handle: null,
            })
            reset_Jwt()
            if (setMsgInfo !== undefined) {
                setMsgInfo({
                    msg: "ログアウトしました!",
                    isError: false,
                })
            }
        } catch (error) {
            alert("Unexpected error...")
            window.location.reload()
        }
        setLoad(false)
        if (reload) {
            window.location.reload()
        }
    }

    return (
        <ProcButton
            handler={handleLogout}
            isProcessing={loading}
            context="ログアウト"
            showAnimation={true}
            className={className} />
    )
}

export default Component
