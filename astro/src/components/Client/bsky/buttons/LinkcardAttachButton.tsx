
import ProcButton from "../../common/ProcButton"
import { Dispatch, SetStateAction } from "react"
import { richTextFacetParser } from "@/utils/richTextParser"
import { getOgpMeta, getOgpBlob } from "@/utils/getOgp"
import { MediaData } from "../type"
import { msgInfo } from "../../common/types"

export const Component = ({
    postText,
    setMediaDataList,
    isProcessing,
    setProcessing,
    showAnimation,
    disabled,
    setMsgInfo,
}: {
    postText: string
    setMediaDataList: Dispatch<SetStateAction<Array<MediaData>>>,
    isProcessing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>,
    showAnimation: boolean,
    disabled: boolean,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
}) => {
    const siteurl = location.origin
    const handlePost = async () => {
        const richTextLinkParser = new richTextFacetParser("link")
        const parseResult = richTextLinkParser.getFacet(postText)
        if (parseResult.length < 1) {
            return
        }
        setProcessing(true)
        setMsgInfo({
            isError: false,
            msg: `リンクカードを取得中...`
        })
        try {
            let blob: Blob | null = null
            // 貼られた最後のlinkからOGPを取得する
            // いずれは任意のURLを選べるようにしたい
            const externalUrl = parseResult[parseResult.length - 1]
            const ogpMeta = await getOgpMeta({
                siteurl,
                externalUrl: externalUrl,
                languageCode: "ja"
            })
            if (ogpMeta.type === "error") {
                let e: Error = new Error(ogpMeta.message)
                e.name = ogpMeta.error
                throw e
            }
            if (ogpMeta.image !== "") {
                blob = await getOgpBlob({
                    siteurl,
                    externalUrl: ogpMeta.image,
                    languageCode: "ja"
                })
            }
            setMediaDataList([{
                type: "linkcard",
                meta: {
                    ...ogpMeta,
                    url: externalUrl
                },
                blob
            }])
            setMsgInfo({
                isError: false,
                msg: `リンクカードを取得しました！`
            })
        } catch (e: unknown) {
            if (e instanceof Error) {
                setMsgInfo({
                    isError: true,
                    msg: `${e.name}: ${e.message}`
                })
            }
            //リンクカード設定を解除
            setMediaDataList([])
        }
        setProcessing(false)
    }

    return (
        <ProcButton
            handler={handlePost}
            isProcessing={isProcessing}
            context="リンクカードを取得"
            showAnimation={showAnimation}
            className={["mx-1"].join(" ")}
            disabled={disabled} />
    )
}
export default Component