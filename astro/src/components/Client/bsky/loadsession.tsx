
import {
    Dispatch, SetStateAction,
    useContext, useEffect
} from "react"
import { Session_context, type msgInfo } from "../common/contexts"
import { read_Jwt, reset_Jwt } from "@/utils/localstorage"
import refreshSession from "@/utils/atproto_api/refreshSession";

export const Component = ({
    setIsLoad,
    setMsgInfo
}: {
    setIsLoad: Dispatch<SetStateAction<boolean>>,
    setMsgInfo?: Dispatch<SetStateAction<msgInfo>>,
}) => {
    const { setSession } = useContext(Session_context)
    setIsLoad(false)

    const handleLoad = async () => {
        const r_jwts = read_Jwt()
        if (r_jwts !== null) {
            try {
                // localstorageにsessionが存在していた場合はtokenをrefresh
                const res = await refreshSession({ refreshJwt: r_jwts.refreshJwt })
                if (typeof res.accessJwt !== "undefined") {
                    setSession({
                        did: res.did,
                        accessJwt: res.accessJwt,
                        refreshJwt: res.refreshJwt,
                        handle: res.handle,
                    })
                    if (setMsgInfo !== undefined) {
                        setMsgInfo({
                            msg: "ログインしました!", isError: false
                        })
                    }
                } else {
                    if (setMsgInfo !== undefined) {
                        setMsgInfo({
                            msg: "再ログインしてください。", isError: true
                        })
                    }
                    reset_Jwt()
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
                reset_Jwt()
            }
        }
        setIsLoad(true)
    }
    useEffect(() => {
        handleLoad()
    }, [])

    return (
        <></>
    )
}

export default Component
