import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { type xContent, type msgInfo } from "../common/types"
import { Profile_context } from "../common/contexts"
import XButton from "./XButton"
import getOgp from "../../../utils/getOgp"
import Tweetbox from "../common/Tweetbox"
import getMeta, { ogpMeta } from "@/utils/getMeta"

export const Component = ({
    xcontent,
    setMsgInfo
}: {
    xcontent: xContent,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>
}) => {
    const { profile } = useContext(Profile_context)
    const [ogpUrl, setOgpUrl] = useState<string | null>(null)
    const [ogpMeta, setOgpMeta] = useState<ogpMeta | null>(null)
    const previewOgp = async () => {
        if (xcontent.url !== "") {
            try {
                let html = await fetch(
                    xcontent.url
                ).then((text) => text.text()
                ).catch()
                const url = getOgp({ content: html })
                const meta = getMeta({ content: html })
                setOgpUrl(url)
                setOgpMeta(meta)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setMsgInfo({
                        isError: true,
                        msg: error.name + ": " + error.message
                    })
                }
                setOgpUrl(null)
                setOgpMeta(null)
            }
        }
    }
    useEffect(() => {
        previewOgp()
    }, [xcontent])
    return (
        <>
            <div className="text-lg font-medium">Xへの投稿プレビュー画面</div>
            <Tweetbox>
                <div className="flex m-2">
                    <div className="flex-none w-fit">
                        <img src={profile?.avatar} className="w-12 h-12 inline-block rounded-full" />
                    </div>
                    <div className="text-left ml-3 break-all">
                        {`${xcontent.content} ${xcontent.url}`}
                    </div>
                </div>
                <div className="block relative h-fit w-fit">
                    {xcontent.url !== "" &&
                        <>
                            {
                                ogpUrl !== null && (
                                    <img src={ogpUrl} className="w-full rounded-3xl" />
                                )
                            }
                            {
                                ogpMeta !== null && (
                                    <div className="absolute bottom-2 left-4 bg-opacity-70 rounded-md px-2 text-white bg-black">
                                        {ogpMeta.title}
                                    </div>
                                )
                            }
                        </>}
                </div>
            </Tweetbox>
            <div className="max-w-xl mx-auto text-left">
                <b>実際の投稿内容は、Xの投稿画面で再度確認お願いします。</b>
                また、文字数がTwitterの制限(140字)を超えている場合はそのまま投稿できません。
                編集により文字数を手動で調整してください。
            </div>
            <div className="text-center">
                <XButton
                    labeltext={"Xでポストする"}
                    twiurl={xcontent.url}
                    content={xcontent.content}
                    disabled={false} />
            </div>
        </>
    )
}
export default Component