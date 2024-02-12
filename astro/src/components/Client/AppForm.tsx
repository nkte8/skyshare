import { useState, Dispatch, SetStateAction } from "react"
import { type Session_info } from "./common/contexts"
import { type msgInfo, type modes, type xContent } from "./common/types"
import LoginForm from "./bsky/LoginForm"
import PostForm from "./bsky/PostForm"
import PageViewForm from "./pagedb/PageViewForm"
import ModeSelectButton from "./common/ModeSelectButton"
import LogoutButton from "./bsky/LogoutButton"
import XForm from "./xcom/XPostForm"

const Component = ({
    session,
    processing,
    setProcessing,
    setMsgInfo,
}: {
    session: Session_info,
    processing: boolean
    setProcessing: Dispatch<SetStateAction<boolean>>
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>
}
) => {
    const [xcontent, setXcontent] = useState<xContent>(null!)
    const Forms = ({ mode }: {
        mode: modes
    }) => {
        switch (mode) {
            case "bsky":
                return <PostForm
                    setXcontent={setXcontent}
                    setMode={setMode}
                    setMsgInfo={setMsgInfo}
                    processing={processing}
                    setProcessing={setProcessing} />
            case "pagedb":
                return <PageViewForm setMsgInfo={setMsgInfo} />
            case "xcom":
                return <XForm
                    setMsgInfo={setMsgInfo}
                    xcontent={xcontent} />
        }
    }

    const [mode, setMode] = useState<modes>("bsky")
    return (<>
        {
            session.accessJwt !== null ? (
                <>
                    {Forms({ mode })}
                    <div className={
                        `flex justify-center`}>
                        <ModeSelectButton
                            mode={mode}
                            setMode={setMode}
                            processing={processing} />
                        <LogoutButton
                            setMsgInfo={setMsgInfo}
                            reload={false}
                            processing={processing}
                            setProcessing={setProcessing} />
                    </div>
                </>
            ) : (
                <LoginForm setMsgInfo={setMsgInfo} />
            )
        }
    </>)
}
export default Component
