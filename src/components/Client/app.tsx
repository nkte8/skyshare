import { useState, } from "react"
import Form from "./form"
import {
    Session_context, Msg_context,
    type Session_info, type msgInfo,
} from "./contexts"

const App = () => {
    const [session, setSession] = useState<Session_info>({
        did: null,
        accessJwt: null,
        refreshJwt: null,
        handle: null,
    })
    const [msgInfo, setMsgInfo] = useState<msgInfo>({ msg: "", isError: false })

    return (
        <div className="p-6 mx-auto
            items-center text-center">
            <Msg_context.Provider value={{ msgInfo, setMsgInfo }}>
                <Session_context.Provider value={{ session, setSession }}>
                    <Form
                        session={session}
                        msgInfo={msgInfo} />
                </Session_context.Provider>
            </Msg_context.Provider>
        </div>
    )
}
export default App