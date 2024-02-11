
import {
    Dispatch, SetStateAction,
    useContext, useEffect
} from "react"
import { Session_context, Profile_context } from "../common/contexts"
import { type msgInfo } from "../common/types"
import { readJwt, resetJwt } from "@/utils/localstorage"
import refreshSession from "@/utils/atproto_api/refreshSession";
import loadProfile from "./loadProfile";

export const Component = ({
    setIsLoad,
    setMsgInfo
}: {
    setIsLoad: Dispatch<SetStateAction<boolean>>,
    setMsgInfo?: Dispatch<SetStateAction<msgInfo>>,
}) => {
    const { setSession } = useContext(Session_context)
    const { setProfile } = useContext(Profile_context)
    const handleLoad = async () => {
        const r_jwts = readJwt()
        if (r_jwts !== null) {
            try {
                // localstorageにsessionが存在していた場合はtokenをrefresh
                const res = await refreshSession({ refreshJwt: r_jwts })
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
                    await loadProfile({
                        session: res,
                        setProfile: setProfile
                    })
                } else {
                    if (setMsgInfo !== undefined) {
                        setMsgInfo({
                            msg: "再ログインしてください。", isError: true
                        })
                    }
                    resetJwt()
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
                resetJwt()
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
