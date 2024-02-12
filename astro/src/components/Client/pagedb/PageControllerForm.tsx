import { Dispatch, SetStateAction } from "react"
import { posturl } from "@/utils/envs"
import { type Session_info } from "../common/contexts"
import { type msgInfo } from "../common/types"
import PageDeleteButton from "./PageDeleteButton"
import ProcButton from "../common/ProcButton"

const Component = ({
    id,
    session,
    setMsgInfo
}: {
    id: string,
    session: Session_info,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
}) => {
    const handleClick = () => {
        location.href = posturl
    }
    return (
        <div className="justify-center">
            {
                session?.accessJwt !== null ? (
                    <>
                        <PageDeleteButton id={id} session={session} setMsgInfo={setMsgInfo} />
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