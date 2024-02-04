import { useState, } from "react"
import { type msgInfo, type Session_info, Hidden_context } from "./common/contexts"
import Login from "./bsky/login"
import PostForm from "./bsky/postform"
import PagesForm from "./pagedb/pageform"
import MsgLabel from "./common/msglabel"
import ModeButton from "./common/modeselect"
import { type modes } from "./common/types"
import Profile from "./bsky/profile"
import LogoutButton from "./bsky/logout"

const Component = ({
    session,
}: {
    session: Session_info,
}
) => {
    const [msgInfo, setMsgInfo] = useState<msgInfo>({ msg: "", isError: false })
    const [loading, setLoad] = useState<boolean>(false)
    const Forms = ({ mode }: {
        mode: modes
    }) => {
        switch (mode) {
            case "bsky":
                return <PostForm setMsgInfo={setMsgInfo} loading={loading} setLoad={setLoad} />
            case "pagedb":
                return <PagesForm setMsgInfo={setMsgInfo} />
        }
    }

    const [mode, setMode] = useState<modes>("bsky")
    const [hidden, setHidden] = useState<boolean>(false)
    return (<>
        {
            session.accessJwt !== null ? (
                <>
                    <Hidden_context.Provider value={{ hidden, setHidden }}>
                        <Profile />
                        {Forms({ mode })}
                        <div className={
                            `flex justify-center ${hidden && "hidden"
                            }`}>
                            <ModeButton mode={mode} setMode={setMode} disabled={loading} />
                            <LogoutButton
                                setMsgInfo={setMsgInfo}
                                reload={false}
                                disabled={loading}
                                setDisabled={setLoad} />
                        </div>

                    </Hidden_context.Provider>
                </>
            ) : (
                <Login setMsgInfo={setMsgInfo} />
            )
        }
        <MsgLabel msgInfo={msgInfo} />
        <div className={session.accessJwt === null ?
            ("mb-16") : ("")
        }></div>
    </>)
}
export default Component
