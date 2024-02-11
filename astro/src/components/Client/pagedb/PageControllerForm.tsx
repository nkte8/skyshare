import { useState } from "react"
import { posturl } from "@/utils/envs"
import InfoLabel from "../common/InfoLabel"
import { type Session_info } from "../common/contexts"
import { type msgInfo } from "../common/types"
import PageDeleteButton from "./PageDeleteButton"
import ProcButton from "../common/ProcButton"

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
                        <InfoLabel msgInfo={msgInfo} />
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