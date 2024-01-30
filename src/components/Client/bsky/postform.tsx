import { memo, useState, useContext } from "react"
import { Session_context, Msg_context } from "../contexts"
import createRecord from "@/utils/atproto_api/createRecord";
import uploadBlob from "@/utils/atproto_api/uploadBlob";
import createPage from "@/utils/bskylinx_api/createPage";
import model_uploadBlob from "@/utils/atproto_api/models/uploadBlob.json";

import ProcButton from "../procButton"
import LogoutButton from "./logout"
import Profile from "./profile"
import ImageForm from "./imgform"
import ImgView from "./imgview"
import TextForm from "./textform"
import Twiurl from "./twiurl"

const MemoImageView = memo(ImgView)
const Component = () => {
    const [loading, setLoad] = useState<boolean>(false)
    const [imageFiles, setImageFile] = useState<File[] | null>(null);
    const [post, setPost] = useState<string>("")
    const [twimsg, setTwimsg] = useState<string>("")
    const [twiurl, setTwiref] = useState<string | null>(null)
    const { session } = useContext(Session_context)
    const { setMsgInfo } = useContext(Msg_context)

    const handlePost = async () => {
        setLoad(true)
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
                const blob_res = await Promise.all(res_que)
                for (let value of blob_res) {
                    if (typeof value.blob.ref.$link === "undefined") {
                        setMsgInfo({
                            msg: "Unexpected upload image error",
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
            const rec_res = await createRecord({
                repo: session.did,
                accessJwt: session.accessJwt,
                record: record,
            })
            if (typeof rec_res.error !== "undefined") {
                let message: string = ""
                switch (rec_res.error) {
                    case "BlobTooLarge":
                        message = "Image compression failed to bsky limit. Sorry..."
                    default:
                        message = "Unexpected upload error"
                }
                setMsgInfo({
                    msg: message,
                    isError: true
                })
            } else {
                setMsgInfo({
                    msg: "Success post to Bluesky!",
                    isError: false
                })
                if (imageFiles !== null) {
                    const get_res = await createPage({
                        accessJwt: session.accessJwt,
                        uri: rec_res.uri
                    })
                    if (typeof get_res.uri !== "undefined") {
                        setMsgInfo({
                            msg: "Success build twiURL!",
                            isError: false
                        })
                        const [id, rkey] = get_res.uri.split("/")
                        setTwimsg(post)
                        setTwiref(`${id}_${rkey}`)
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
                msg: "Unexpected error",
                isError: true
            })
        }
        setLoad(false)
    }

    return (
        <>
            <Profile />
            <MemoImageView
                imageFiles={imageFiles} />
            <ImageForm
                disabled={loading}
                setImageFile={setImageFile}
            />
            <Twiurl context={twimsg} twiurl={twiurl} />
            <TextForm
                post={post}
                setPost={setPost} />
            <div className="mt-2 inline">
                <ProcButton
                    handler={handlePost}
                    isProcessing={loading}
                    context="Post" />
                <LogoutButton />
            </div>
        </>
    );
}

export default Component