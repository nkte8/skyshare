import { useState, } from "react"
import { type msgInfo, type Session_info } from "./common/contexts"
import Login from "./bsky/login"
import PostForm from "./bsky/postform"
import PagesForm from "./bskylinx/pageform"
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
    const Forms = (mode: modes) => {
        switch (mode) {
            case "bsky":
                return <PostForm setMsgInfo={setMsgInfo} />
            case "pagedb":
                return <PagesForm setMsgInfo={setMsgInfo} />
        }
    }

    const [mode, setMode] = useState<modes>("bsky")
    return (<>
        {
            session.accessJwt !== null ? (
                <>
                    <Profile setMsgInfo={setMsgInfo} />
                    {Forms(mode)}
                    <div className="flex justify-center">
                        <ModeButton mode={mode} setMode={setMode} />
                        <LogoutButton setMsgInfo={setMsgInfo} reload={false} />
                    </div>
                    <MsgLabel msgInfo={msgInfo} />

                </>
            ) : (
                <Login setMsgInfo={setMsgInfo} />
            )
        }
    </>)
}
export default Component
