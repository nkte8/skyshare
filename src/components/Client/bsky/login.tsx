import { useState, useContext } from "react"
import { inputtext_base } from "../tailwind_variants"
import { Session_context, Msg_context } from "../contexts"
import createSession from "@/utils/atproto_api/createSession";
import { write_Jwt } from "@/utils/localstorage"
import ProcButton from "../procButton"

export const Component = () => {
    const [loading, setLoad] = useState<boolean>(false)
    const [identifier, setIdentifer] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const { setSession } = useContext(Session_context)
    const { setMsgInfo } = useContext(Msg_context)

    const handleLogin = async () => {
        setLoad(true)
        try {
            const res = await createSession({
                identifier: identifier,
                password: password
            })
            if (typeof res.accessJwt !== "undefined") {
                setSession(res)
                // セッションをlocalstorageへ保存
                write_Jwt({
                    refreshJwt: res.refreshJwt
                })
                setMsgInfo({
                    msg: "Login successed!",
                    isError: false,
                })
            } else {
                setMsgInfo({
                    msg: "Login failed...",
                    isError: true,
                })
            }
        } catch (error) {
            alert("Unknow error, sorry...")
            window.location.reload()
        }
        setLoad(false)
    }

    return (
        <>
            <div>
                <label className="w-28 inline-block">
                    Email or ID:
                </label>
                <input onChange={(event) => setIdentifer(event.target.value)}
                    className={inputtext_base({ class: "max-w-48 w-full" })} type="text" />
            </div>
            <div>
                <label className="w-28 inline-block">
                    App Password:
                </label>
                <input onChange={(event) => setPassword(event.target.value)}
                    className={inputtext_base({ class: "max-w-48 w-full" })} type="password" />
            </div>
            <div>
                <ProcButton
                    handler={handleLogin}
                    isProcessing={loading}
                    context="Bluesky Login" />
            </div>
        </>
    )
}

export default Component