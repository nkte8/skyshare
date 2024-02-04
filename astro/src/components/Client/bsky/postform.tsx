import { memo, useState, useContext, Dispatch, SetStateAction } from "react"
import { Session_context, Hidden_context, type msgInfo } from "../common/contexts"
import createRecord from "@/utils/atproto_api/createRecord";
import detectFacets from "@/utils/atproto_api/detectFacets";
import uploadBlob from "@/utils/atproto_api/uploadBlob";
import createPage from "@/utils/backend_api/createPage";
import model_uploadBlob from "@/utils/atproto_api/models/uploadBlob.json";
import { link } from "../common/tailwind_variants";
import ProcButton from "../common/procButton"
import ImageForm from "./imgform"
import ImgView from "./imgview"
import TextForm from "./textform"
import Twiurl from "./twibutton"

const MemoImageView = memo(ImgView)
const Component = ({
    setMsgInfo,
    loading,
    setLoad
}: {
    loading: boolean,
    setLoad: Dispatch<SetStateAction<boolean>>,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>
}) => {
    const [imageFiles, setImageFile] = useState<File[] | null>(null);
    const [post, setPost] = useState<string>("")
    const [count, setCount] = useState<number>(0)
    const [twimsg, setTwimsg] = useState<string>("")
    const [twiurl, setTwiref] = useState<string | null>(null)
    const { hidden, setHidden } = useContext(Hidden_context)
    const { session } = useContext(Session_context)

    const handlePost = async () => {
        setLoad(true)
        setTwiref(null)
        setTwimsg("")
        // Postを押したら強制的にフォーカスアウトイベントを発火
        handleOnBlur()

        setMsgInfo({
            msg: "レコードに変換中...",
            isError: false
        })
        let record: object = {
            text: post,
            createdAt: new Date(),
        }
        let facets = await detectFacets({ text: post })
        if (facets.length > 0) {
            record = {
                ...record,
                facets: facets
            }
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
                    msg: "画像のアップロード中...",
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
                msg: "Blueskyへ投稿中...",
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
                        message = "画像の圧縮に失敗しました..."
                        break
                    default:
                        message = "Unexpected error..."
                }
                setMsgInfo({
                    msg: message,
                    isError: true
                })
            } else {
                setMsgInfo({
                    msg: "Blueskyへ投稿しました!",
                    isError: false
                })
                if (imageFiles !== null) {
                    setMsgInfo({
                        msg: "Twitter用ページ生成中...",
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
                handlerCancel()
            }
        } catch {
            setMsgInfo({
                msg: "Unexpected error...",
                isError: true
            })
        }
        setLoad(false)
    }
    const handlerCancel = () => {
        setImageFile(null)
        setPost("")
        setCount(0)
    }
    const handleOnFocus = () => {
        setHidden(true)
    }
    const handleOnBlur = () => {
        setHidden(false)
    }
    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPost(event.target.value)
        const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'grapheme' })
        const segments = segmenterJa.segment(event.currentTarget.value)
        setCount(Array.from(segments).length)
    }

    return (
        <>
            <MemoImageView
                imageFiles={imageFiles} />
            <TextForm
                onfocus={handleOnFocus}
                onblur={handleOnBlur}
                post={post}
                disabled={loading}
                onChange={handleOnChange} />
            <div className="mx-auto mb-4 sm:max-w-80">
                <div className="flex">
                    <button
                        onClick={handlerCancel}
                        className={link({
                            enabled: (post.length >= 1 || imageFiles !== null),
                            class: "inline-block mx-2"
                        })}
                        disabled={!(post.length >= 1 || imageFiles !== null)}>
                        キャンセル
                    </button>
                    <ImageForm
                        disabled={loading}
                        setImageFile={setImageFile}
                        className="py-0"
                    />
                    <div className="flex-1"></div>
                    <div className="align-middle my-auto mr-1">{count}/300</div>
                    <ProcButton
                        handler={handlePost}
                        isProcessing={loading}
                        context="Post"
                        showAnimation={true}
                        color="blue"
                        disabled={!(post.length >= 1 || imageFiles !== null)} />
                </div>
                <div className={`flex sm:my-auto my-1 ${hidden && "hidden"}`}>
                    <div className="flex-1 sm:inline-block"></div>
                    <Twiurl context={twimsg} twiurl={twiurl} />
                </div>
            </div >
        </>
    );
}

export default Component