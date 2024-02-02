import { useState } from "react"
import MsgLabel from "../common/msglabel"
import { type msgInfo, type Session_info } from "../common/contexts"
import PageDeleteButton from "./pagedelete"
const Component = ({
    id,
    session,
}: {
    id: string,
    session: Session_info,
}) => {
    const [msgInfo, setMsgInfo] = useState<msgInfo>({ msg: "", isError: false })

    return (
        <div className="justify-center">
            <MsgLabel msgInfo={msgInfo} />
            <PageDeleteButton id={id} session={session} setMsgInfo={setMsgInfo} />
        </div>
    )
}
export default Component