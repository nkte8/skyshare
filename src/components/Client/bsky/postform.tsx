import { memo, useState, useContext, Dispatch, SetStateAction } from "react"
import { Session_context, type msgInfo } from "../common/contexts"
import createRecord from "@/utils/atproto_api/createRecord";
import uploadBlob from "@/utils/atproto_api/uploadBlob";
import createPage from "@/utils/bskylinx_api/createPage";
import model_uploadBlob from "@/utils/atproto_api/models/uploadBlob.json";

import ProcButton from "../common/procButton"
import ImageForm from "./imgform"
import ImgView from "./imgview"
import TextForm from "./textform"
import Twiurl from "./twibutton"

const MemoImageView = memo(ImgView)
const Component = ({
    setMsgInfo
}: {
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>
}) => {
    const [loading, setLoad] = useState<boolean>(false)
    const [imageFiles, setImageFile] = useState<File[] | null>(null);
    const [post, setPost] = useState<string>("")
    const [twimsg, setTwimsg] = useState<string>("")
    const [twiurl, setTwiref] = useState<string | null>(null)
    const { session } = useContext(Session_context)

    const handlePost = async () => {
        setLoad(true)
        setTwiref(null)
        setTwimsg("")
        let record: object = {
            text: post,
            createdAt: new Date(),
        }
        try {
            if (session.accessJwt === null || session.did === null) {
                return
            }
            if (imageFiles !== null) {
                let res_que: Array<Promise<typeof model_uploadBlob>> = []
                for (let i = 0; i < imageFiles.length; i++) {
                    res_que.push(uploadBlob({
                        accessJwt: session!.accessJwt,
                        mimeType: imageFiles[i].type,
                        blob: new Uint8Array(await imageFiles[i].arrayBuffer())
                    }))
                }
                setMsgInfo({
                    msg:  "画像のアップロード中...",
                    isError: false
                })
                const blob_res = await Promise.all(res_que)
                for (let value of blob_res) {
                    if (typeof value.blob.ref.$link === "undefined") {
                        setMsgInfo({
                            msg: "画像のアップロードに失敗しました...",
                            isError: true
                        })
                        setLoad(false)
                        return
                    }
                }
                let images: Array<{
                    image: { cid: string, mimeType: string },
                    alt: string
                }> = []
                blob_res.forEach((value) => {
                    images.push({
                        image: {
                            cid: value.blob.ref.$link,
                            mimeType: value.blob.mimeType
                        },
                        alt: ""
                    })
                })
                record = {
                    ...record,
                    embed: {
                        $type: "app.bsky.embed.images",
                        images: images
                    }
                }
            }
            setMsgInfo({
                msg:  "Blueskyへ投稿中...",
                isError: false
            })
            const rec_res = await createRecord({
                repo: session.did,
                accessJwt: session.accessJwt,
                record: record,
            })
            if (typeof rec_res.error !== "undefined") {
                let message: string = ""
                switch (rec_res.error) {
                    case "BlobTooLarge":
                        message =  "画像の圧縮に失敗しました..."
                        break
                    default:
                        message =  "Unexpected error..."
                }
                setMsgInfo({
                    msg: message,
                    isError: true
                })
            } else {
                setMsgInfo({
                    msg:  "Blueskyへ投稿しました!",
                    isError: false
                })
                if (imageFiles !== null) {
                    setMsgInfo({
                        msg:  "Twitter用ページ生成中...",
                        isError: false
                    })
                    const get_res = await createPage({
                        accessJwt: session.accessJwt,
                        uri: rec_res.uri
                    })
                    if (typeof get_res.uri !== "undefined") {
                        setMsgInfo({
                            msg: "Twitter用リンクを生成しました!",
                            isError: false
                        })
                        const [id, rkey] = get_res.uri.split("/")
                        setTwimsg(post)
                        setTwiref(`${id}@${rkey}`)
                    }
                } else {
                    setTwimsg(post)
                    setTwiref("")
                }
                setImageFile(null)
                setPost("")
            }
        } catch {
            setMsgInfo({
                msg: "Unexpected error...",
                isError: true
            })
        }
        setLoad(false)
    }

    return (
        <>
            <MemoImageView
                imageFiles={imageFiles} />

            <TextForm
                post={post}
                setPost={setPost} />
            <ImageForm
                disabled={loading}
                setImageFile={setImageFile}
            />
            <ProcButton
                handler={handlePost}
                isProcessing={loading}
                context="Blueskyへ投稿"
                showAnimation={true} />
            <Twiurl context={twimsg} twiurl={twiurl} />
        </>
    );
}

export default Component