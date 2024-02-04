import { useState } from "react"
import { posturl } from "@/utils/vars"
import MsgLabel from "../common/msglabel"
import { type msgInfo, type Session_info } from "../common/contexts"
import PageDeleteButton from "./pagedelete"
import ProcButton from "../common/procButton"

const Component = ({
    id,
    session,
}: {
    id: string,
    session: Session_info,
}) => {
    const [msgInfo, setMsgInfo] = useState<msgInfo>({ msg: "", isError: false })
    const handleClick = () => {
        location.href = posturl
    }
    return (
        <div className="justify-center">
            {
                session?.accessJwt !== null ? (
                    <>
                        <PageDeleteButton id={id} session={session} setMsgInfo={setMsgInfo} />
                        <MsgLabel msgInfo={msgInfo} />
                    </>
                ) : (
                    <ProcButton handler={handleClick}
                        isProcessing={false}
                        showAnimation={false}
                        context="ログイン" />
                )
            }
        </div>
    )
}
export default Component