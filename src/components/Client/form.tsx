import { useState, } from "react"
import { type msgInfo, type Session_info } from "./contexts"
import Login from "./bsky/login"
import PostForm from "./bsky/postform"
import Session from "./bsky/loadsession"
import MsgLabel from "./msglabel"

const Component = ({
    session,
    msgInfo
}: {
    session: Session_info,
    msgInfo: msgInfo
}
) => {
    const [isLoad, setIsLoad] = useState<boolean>(false)
    return (<>
        <MsgLabel msgInfo={msgInfo} />
        {
            isLoad ? (
                session.accessJwt !== null ? (
                    <>
                        <PostForm />
                    </>
                ) : (
                    <Login />
                )
            ) : (
                <Session setIsLoad={setIsLoad} />
            )
        }
    </>)
}
export default Component
