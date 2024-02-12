
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
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
}) => {
    const { setSession } = useContext(Session_context)
    const { setProfile } = useContext(Profile_context)
    const handleLoad = async () => {
        const r_jwts = readJwt()
        if (r_jwts !== null) {
            try {
                // localstorageにsessionが存在していた場合はtokenをrefresh
                setMsgInfo({
                    msg: "セッションの再開中...", isError: false
                })
                const refreshResult = await refreshSession({ refreshJwt: r_jwts })
                if (typeof refreshResult?.error !== "undefined") {
                    resetJwt()
                    let e: Error = new Error(refreshResult.message)
                    e.name = refreshResult.error
                    throw e
                }
                setSession({
                    did: refreshResult.did,
                    accessJwt: refreshResult.accessJwt,
                    refreshJwt: refreshResult.refreshJwt,
                    handle: refreshResult.handle,
                })
                setMsgInfo({
                    msg: "セッションを再開しました!", isError: false
                })
                const resLoadProfile = await loadProfile({
                    session: refreshResult,
                    setProfile: setProfile
                })
                if (typeof resLoadProfile?.error !== "undefined") {
                    let e: Error = new Error(resLoadProfile.message)
                    e.name = resLoadProfile.error
                    throw e
                }

            } catch (error: unknown) {
                let msg: string = "Unexpected Unknown Error"
                if (error instanceof Error) {
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
