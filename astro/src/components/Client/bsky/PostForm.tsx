import { memo, useState, useContext, Dispatch, SetStateAction } from "react"
import { Session_context } from "../common/contexts"
import { type msgInfo, type modes, type xContent } from "../common/types"

import createRecord from "@/utils/atproto_api/createRecord";
import detectFacets from "@/utils/atproto_api/detectFacets";
import uploadBlob from "@/utils/atproto_api/uploadBlob";
import createPage from "@/utils/backend_api/createPage";
import model_uploadBlob from "@/utils/atproto_api/models/uploadBlob.json";
import model_error from "@/utils/atproto_api/models/error.json";

import { link } from "../common/tailwind_variants";

import { pagesPrefix } from "@/utils/vars";
import getOgp from "@/utils/getOgp"
import getMeta from "@/utils/getMeta"

import Tweetbox from "../common/Tweetbox"
import ImgForm from "./ImgForm"
import ImgViewBox from "./ImgViewBox"
import TextForm from "./TextForm"
import XPopup from "../xcom/xpopup"
import AutoXPopupToggle from "./AutoXPopupToggle"
import NoGenerateToggle from "./NoGenerateToggle"
import PostButton from "./PostButton"
import Details from "./Details"

const siteurl = location.origin
const MemoImgViewBox = memo(ImgViewBox)
const Component = ({
    setMsgInfo,
    processing,
    setProcessing,
    setMode,
    setXcontent
}: {
    processing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
    setMode: Dispatch<SetStateAction<modes>>,
    setXcontent: Dispatch<SetStateAction<xContent>>,
}) => {
    // ImgFormにて格納されるimageとディスパッチャー
    const [imageFiles, setImageFile] = useState<File[] | null>(null);
    // Post内容を格納する変数とディスパッチャー
    const [post, setPost] = useState<string>("")
    // Postの文字数を格納する変数とディスパッチャー
    const [count, setCount] = useState<number>(0)
    // ポスト時に自動でXを開く
    const [autoPop, setAutoPop] = useState<boolean>(false)
    // OGP画像を生成しない（Embedを有効にする）
    const [noGenerate, setNoGenerate] = useState<boolean>(false)
    // Postの実行状態を管理する変数とディスパッチャー
    const [isPostProcessing, setPostProcessing] = useState<boolean>(false)
    // セッション
    const { session } = useContext(Session_context)
    // Postの入力上限
    const countMax = 300

    const initializePost = () => {
        setPostProcessing(true)
        setProcessing(true)
        // Postを押したら強制的にフォーカスアウトイベントを発火
    }

    const handlePost = async () => {
        initializePost()
        setMsgInfo({
            msg: "レコードに変換中...",
            isError: false
        })
        let record: object = {
            text: post,
            createdAt: new Date(),
        }
        let facets = await detectFacets({ text: post })
        let xContent: xContent = {
            url: "",
            content: post
        }
        if (facets.length > 0) {
            record = {
                ...record,
                facets: facets
            }
        }
        try {
            if (session.accessJwt === null || session.did === null) {
                let e: Error = new Error("フロントエンドが想定していない操作が行われました。")
                e.name = "Unexpected Error@postform.tsx"
                throw e
            }
            if (count > countMax) {
                let e: Error = new Error("文字数制限を超えています。")
                e.name = "postform.tsx"
                throw e
            }
            // 画像のアップロードを行う場合の処理
            if (!noGenerate && imageFiles !== null) {
                let res_que: Array<Promise<typeof model_uploadBlob & typeof model_error>> = []
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
                // 画像アップロードに失敗したファイルが一つでも存在した場合停止する
                for (let value of blob_res) {
                    if (typeof value?.error !== "undefined") {
                        let e: Error = new Error(value.message)
                        e.name = value.error
                        throw e
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
            // 画像のアップロードを行わない（代わりにURL埋め込みを行う）
            if (noGenerate && facets.length > 0) {
                let linkcardUrl: string | null = null
                facets.forEach((value) => {
                    const facetObj = value.features[0]
                    if (facetObj.$type === "app.bsky.richtext.facet#link") {
                        linkcardUrl = facetObj.uri
                    }
                })
                // 最後に添付されたlinkをembetとして扱う
                if (linkcardUrl !== null) {
                    const html = await fetch(linkcardUrl).then((text) => text.text())
                    const ogpUrl = getOgp({ content: html })
                    const [title, description] = getMeta({ content: html })

                    const blob = await fetch(ogpUrl).then(res => res.blob())
                    // リンク先のOGPからblobを作成し、mimeTypeの設定&バイナリのアップロードを実施
                    const res_ogp = await uploadBlob({
                        accessJwt: session.accessJwt,
                        mimeType: blob.type,
                        blob: new Uint8Array(await blob.arrayBuffer())
                    })
                    // 例外処理
                    if (typeof res_ogp?.error !== "undefined") {
                        let e: Error = new Error(res_ogp.message)
                        e.name = res_ogp.error
                        throw e
                    }
                    const embed = {
                        "$type": "app.bsky.embed.external",
                        external: {
                            uri: linkcardUrl,
                            title: title,
                            description: description,
                            thumb: res_ogp.blob,
                        }
                    }
                    record = {
                        ...record,
                        embed: embed
                    }
                    // X向けにもリンクを添付
                    xContent.url = linkcardUrl
                    // 本文からリンクの文字列を削除
                    xContent.content = post.replace(linkcardUrl, "")
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
            if (typeof rec_res?.error !== "undefined") {
                let e: Error = new Error(rec_res.message)
                e.name = rec_res.error
                throw e
            }
            setMsgInfo({
                msg: "Blueskyへ投稿しました!",
                isError: false
            })
            if (!noGenerate && imageFiles !== null) {
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
                    xContent.url = new URL(`${pagesPrefix}/${id}@${rkey}/`, siteurl).toString()
                }
            }
            if (autoPop) {
                XPopup(xContent)
            } else {
                setXcontent(xContent)
                setMode("xcom")
            }
            handlerCancel()
        } catch (error: unknown) {
            let msg: string = "Unexpected Unknown Error"
            if (error instanceof Error) {
                msg = error.name + ": " + error.message
            }
            setMsgInfo({
                msg: msg,
                isError: true
            })
        }
        setProcessing(false)
        setPostProcessing(false)
    }
    const handlerCancel = () => {
        setImageFile(null)
        setPost("")
        setCount(0)
    }
    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPost(event.target.value)
        try {
            const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'grapheme' })
            const segments = segmenterJa.segment(event.currentTarget.value)
            setCount(Array.from(segments).length)
        } catch (e) {
            // Intl.Segmenterがfirefoxでは未対応であるため、やむをえずレガシーな方法で対処
            // 絵文字のカウント数が想定より多く設定されてしまうため、firefox_v125までは非推奨ブラウザとする
            setCount(event.currentTarget.value.length)
        }
    }

    return (
        <>
            <Tweetbox>
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
                    <div className="flex-1 my-0"></div>
                    <PostButton
                        handlePost={handlePost}
                        isProcessing={processing}
                        isPostProcessing={isPostProcessing}
                        disabled={!(post.length >= 1 || imageFiles !== null)} />
                </div>
                <TextForm
                    post={post}
                    disabled={isPostProcessing}
                    onChange={handleOnChange} />
                <div className="flex">
                    <ImgForm
                        disabled={isPostProcessing}
                        setImageFile={setImageFile}
                        className="py-0"
                    />

                    <div className="flex-1"></div>
                    <div className={`align-middle my-auto mr-1 px-2 rounded-lg ${count > countMax && "bg-red-300"}`}>{count}/300</div>

                </div>

                <Details
                    initValue={!(autoPop || noGenerate)}>
                    <div className="flex flex-wrap">
                        <AutoXPopupToggle
                            labeltext={"Xを自動で開く"}
                            prop={autoPop}
                            setProp={setAutoPop} />
                        <NoGenerateToggle
                            labeltext={<>
                                OGPを<b>生成しない</b>(埋め込みURL有効化)
                            </>}
                            prop={noGenerate}
                            setProp={setNoGenerate} />
                    </div>
                </Details>
                <MemoImgViewBox
                    imageFiles={imageFiles} />
            </Tweetbox>
        </>
    );
}

export default Component