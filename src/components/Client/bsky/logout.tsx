import { useState, useContext } from "react"
import { Session_context, Msg_context } from "../contexts"
import deleteSession from "@/utils/atproto_api/deleteSession";
import { reset_Jwt } from "@/utils/localstorage";
import ProcButton from "../procButton"

export const Component = () => {
    const [loading, setLoad] = useState<boolean>(false)
    const { session, setSession } = useContext(Session_context)
    const { setMsgInfo } = useContext(Msg_context)

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
            setMsgInfo({
                msg: "Logout successed",
                isError: false,
            })

            // if (typeof res?.error === "undefined") {
            //     setSession({
            //         did: null,
            //         accessJwt: null,
            //         refreshJwt: null
            //     })
            //     reset_Jwt()
            //     setMsgInfo({
            //         msg: "Logout successed",
            //         isError: false,
            //     })
            // } else {
            //     setMsgInfo({
            //         msg: "Logout failed...",
            //         isError: true,
            //     })
            // }
        } catch (error) {
            alert("Unknow error, sorry...")
            window.location.reload()
        }
        setLoad(false)
    }

    return (
        <ProcButton
            handler={handleLogout}
            isProcessing={loading}
            context="Logout" />
    )
}

export default Component
