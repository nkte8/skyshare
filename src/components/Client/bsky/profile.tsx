import { useState, useContext, useEffect, Dispatch, SetStateAction } from "react"
import { Session_context } from "../common/contexts"
import { link } from "../common/tailwind_variants";
import getProfile from "@/utils/atproto_api/getProfile";
import { type msgInfo } from "../common/contexts"

export const Component = ({
    setMsgInfo,
}: {
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>
}) => {
    const [, setLoad] = useState<boolean>(false)
    const [profref, setProfref] = useState<string>("")
    const [profinfo, setProfinfo] = useState<{
        handle: string,
        displayName: string,
        avatar: string,
    } | null>(null)
    const { session } = useContext(Session_context)

    const handleLoad = async () => {
        setLoad(true)
        try {
            if (session.accessJwt === null || session.handle === null) {
                return
            }
            const res = await getProfile({
                accessJwt: session.accessJwt,
                handle: session.handle
            })
            if (typeof res.avatar !== "undefined") {
                setProfinfo(res)
                setProfref(res.handle)
            }
        } catch (error) {
        }
        setLoad(false)
    }

    useEffect(() => {
        handleLoad()
    }, [])
    return (
        <>
            <div className="w-fit mx-auto p-1 rounded-lg mb-1 border-2 max-w-fit">
                <img src={profinfo?.avatar} className="w-10 h-10 mr-2 inline-block rounded-full" />
                <span className="mx-1 text-wrap">{profinfo?.displayName}
                    <a href={new URL(profref, "https://bsky.app/profile/").toString()}
                        className={link({ class: "m-1" })}>
                        @{profinfo?.handle}
                    </a>
                </span>
            </div>
        </>
    )
}

export default Component