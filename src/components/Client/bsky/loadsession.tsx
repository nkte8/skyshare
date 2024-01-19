
import {
    Dispatch, SetStateAction,
    useContext, useEffect
} from "react"
import { Session_context, Msg_context } from "../contexts"
import { read_Jwt, reset_Jwt } from "@/utils/localstorage"
import { load_circle } from "../tailwind_variants"
import refreshSession from "@/utils/atproto_api/refreshSession";

export const Component = ({
    setIsLoad
}: { setIsLoad: Dispatch<SetStateAction<boolean>> }) => {

    const { setSession } = useContext(Session_context)
    const { setMsgInfo } = useContext(Msg_context)
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
                    setMsgInfo({
                        msg: "Login successed!", isError: false
                    })
                } else {
                    // tokenが無効になっていた場合はlocalstorageをリセット
                    setMsgInfo({
                        msg: "Session disconnected. Login Again.", isError: true
                    })
                    reset_Jwt()
                }
            } catch (e) {
                reset_Jwt()
            }
        }
        setIsLoad(true)
    }
    useEffect(() => {
        handleLoad()
    }, [])

    return (
        <>
            <svg className={load_circle({ size: "l" })} viewBox="-30 -30 160 160" xmlns="http://www.w3.org/2000/svg">
                <path d="M94,50 a44,44,0,1,1,-44,-44"
                    stroke="#7dd3fc" fill="none"
                    strokeWidth="14" strokeLinecap="round" />
            </svg>
        </>
    )
}

export default Component
