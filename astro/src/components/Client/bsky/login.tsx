import { useState, useContext, Dispatch, SetStateAction } from "react"
import { inputtext_base, link } from "../common/tailwind_variants"
import { Session_context, type msgInfo } from "../common/contexts"
import createSession from "@/utils/atproto_api/createSession";
import { write_Jwt } from "@/utils/localstorage"
import ProcButton from "../common/procButton"
import Tooltip from "../common/toolctip"

export const Component = ({
    setMsgInfo,
}: {
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
}) => {
    const [loading, setLoad] = useState<boolean>(false)
    const [identifier, setIdentifer] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const { setSession } = useContext(Session_context)

    const handleLogin = async () => {
        setLoad(true)
        try {
            const res = await createSession({
                identifier: identifier,
                password: password
            })
            if (typeof res.error !== "undefined") {
                setMsgInfo({
                    msg: "ログイン出来ませんでした...",
                    isError: true,
                })
            } else {
                setSession(res)
                // セッションをlocalstorageへ保存
                write_Jwt({
                    refreshJwt: res.refreshJwt
                })
                setMsgInfo({
                    msg: "ログインしました!",
                    isError: false,
                })
            }

        } catch (error) {
            alert("Unexpected error")
            window.location.reload()
        }
        setLoad(false)
    }

    return (
        <>
            <div className="mt-16">
                <div className="align-middle">
                    <label className="w-32 inline-block my-auto">
                        Email or ID:
                    </label>
                    <input onChange={(event) => setIdentifer(event.target.value)}
                        className={inputtext_base({ class: "max-w-48 w-full" })} type="text" />
                </div>
                <div className="align-middle">
                    <label className="w-32 inline-block my-auto">
                        AppPassword※:
                    </label>
                    <input onChange={(event) => setPassword(event.target.value)}
                        className={inputtext_base({ class: "max-w-48 w-full" })} type="password" />
                </div>
                <div className="my-2">
                    <ProcButton
                        handler={handleLogin}
                        isProcessing={loading}
                        context="Blueskyアカウントへログイン"
                        disabled={!(identifier.length > 0 && password.length > 0)}
                        showAnimation={true} />
                </div>
                <Tooltip tooltip={
                    <div className="flex flex-col sm:flex-row">
                        <div className="inline-block px-4 py-2 text-left">
                            （BskyLinXに限らず）非公式のアプリを使う際はAppPasswordの利用が推奨されています。
                            <a className={link()}
                                target="_blank"
                                href="https://bsky.app/settings/app-passwords">
                                <b>bsky.appの⚙設定</b>→<b>🔒高度な設定(新規タブが開きます)</b>
                            </a>から生成してください。
                        </div>
                    </div>
                }>
                    <span className="text-sky-400">
                        ※AppPasswordとは？(タップで説明を表示)
                    </span>
                </Tooltip>
            </div>
        </>
    )
}

export default Component