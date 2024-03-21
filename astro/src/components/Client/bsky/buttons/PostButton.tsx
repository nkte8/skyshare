// utils
import { useContext, Dispatch, SetStateAction } from "react"
import { useKey } from "react-use"
import type { KeyPredicate } from "react-use/lib/useKey"

// components
import { Session_context } from "../../common/contexts"
import ProcButton from "../../common/ProcButton"

// atproto
import { label } from "@/utils/atproto_api/labels";
import detectFacets from "@/utils/atproto_api/detectFacets";
import createRecord from "@/utils/atproto_api/createRecord";
import type record from "@/utils/atproto_api/record";
import uploadBlob, { type uploadBlobResult } from "@/utils/atproto_api/uploadBlob";

// backend api
import createPage from "@/lib/pagedbAPI/createPage";
import { richTextFacetParser } from "@/utils/richTextParser"
import browserImageCompression from "@/utils/browserImageCompression"
import { getOgpBlob, getOgpMeta } from "@/lib/getOgp"

// service
import { setSavedTags, readSavedTags } from "@/utils/useLocalStorage";
import { callbackPostOptions } from "../PostForm"
import { msgInfo, MediaData } from "../../common/types"
import { servicename } from "@/env/vars"
import { pagesPrefix } from "@/env/envs"


export const Component = ({
    postText,
    language,
    selfLabel,
    options,
    mediaData,
    callback,
    isProcessing,
    setProcessing,
    setMsgInfo,
    disabled,
}: {
    postText: string,
    language: string,
    selfLabel: label.value | null,
    options: {
        appendVia: boolean
        noGenerateOgp: boolean
        // autoPopup: boolean
    },
    mediaData: MediaData | null,
    callback: (options: callbackPostOptions) => void,
    isProcessing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
    disabled: boolean
}) => {
    // 配置されたサイトのURL
    const siteurl = location.origin
    // セッション
    const { session } = useContext(Session_context)
    // 保存できるタグの上限
    const maxTagCount = 8
    /** Apple製品利用者の可能性がある場合True */
    const isAssumedAsAppleProdUser =
        navigator.userAgent.toLowerCase().includes("mac os x")

    const handlePost = async () => {
        const isValidPost = (): boolean => {
            let result: boolean = postText.length >= 1
            if (mediaData !== null) {
                result = result || mediaData.images.length > 0
            }
            return result
        }

        if (!isValidPost()) {
            setMsgInfo({
                msg: "ポスト本文が存在しないか、メディアが添付されていません。",
                isError: true
            })
            return
        }

        const initializePost = () => {
            setProcessing(true)
            // Postを押したら強制的にフォーカスアウトイベントを発火
        }
        initializePost()
        setMsgInfo({
            msg: "レコードを作成中...",
            isError: false
        })
        try {
            // プレビューへ送るテキストを別途初期化
            const callbackPostPotions: callbackPostOptions = {
                postText,
                previewTitle: null,
                previewData: null
            }
            // facetを取得
            const facets = await detectFacets({ text: postText })
            // 今後公式APIを使うことを考慮し、recordBuilder.tsの利用を終了
            let Record: record = {
                text: postText,
                createdAt: new Date(),
                langs: [language],
                $type: "app.bsky.feed.post",
                labels: (selfLabel !== null) ? {
                    $type: "com.atproto.label.defs#selfLabels",
                    values: [selfLabel]
                } : undefined,
                via: (
                    options.appendVia !== false
                ) ? servicename : undefined,
                facets: (
                    facets.length > 0
                ) ? facets : undefined
            }

            // Hashtagが含まれている場合はブラウザに保存
            const richTextLinkParser = new richTextFacetParser("tag")
            const parseResult = richTextLinkParser.getFacet(postText)
            console.log(parseResult)
            const savedTag = readSavedTags()
            let taglist: string[] = (savedTag !== null) ? savedTag : []
            parseResult.forEach((value) => {
                const tagName = value
                const tagIndex = taglist.indexOf(tagName)
                if (tagIndex < 0) {
                    // タグが存在しない場合は先頭に追加
                    taglist.unshift(tagName)
                } else {
                    // タグが存在する場合は先頭に移動
                    taglist.splice(tagIndex, 1)
                    taglist.unshift(tagName)
                }
            })
            setSavedTags(taglist.slice(0, maxTagCount))

            // 投稿の文字制限を解除（API側に処理させる）
            // また、ツリー投稿機能の実装の際は分割方法を検討すること

            const ImageAttached = (
                mediaData !== null &&
                mediaData.images.length > 0 &&
                mediaData.images[0].blob !== null
            )
            // uploadBlobを行なった場合は結果が格納される
            let resultUploadBlob: Array<uploadBlobResult> = []

            // メディアデータが存在する場合はRecordに対して特定の処理を行う
            if (ImageAttached) {
                // メディアのデータを圧縮
                let compressTasks: Array<Promise<ArrayBuffer>> = []
                mediaData.images.forEach((value, index) => {
                    if (value.blob !== null) {
                        const file: File = new File(
                            [value.blob],
                            `media${index}.data`,
                            { type: value.blob.type })
                        compressTasks.push(
                            browserImageCompression(file).then(
                                async value => await value.arrayBuffer()
                            ))
                    }
                })
                // compressを並列処理
                const resultCompress: Array<ArrayBuffer> =
                    await Promise.all(compressTasks
                    ).then(
                        (values) => {
                            return values
                        }
                    )
                let uploadBlobTasks: Array<Promise<uploadBlobResult>> = []
                resultCompress.forEach((value) => {
                    uploadBlobTasks.push(
                        uploadBlob({
                            accessJwt: session.accessJwt,
                            mimeType: 'image/jpeg',
                            blob: new Uint8Array(value)
                        })
                    )
                })
                // uploadBlobを並列処理
                resultUploadBlob =
                    await Promise.all(uploadBlobTasks
                    ).then(
                        (values) => {
                            return values
                        }
                    )
                // Blobのアップロードに失敗したファイルが一つでも存在した場合停止する
                resultUploadBlob.forEach((value) => {
                    if (typeof value?.error !== "undefined") {
                        let e: Error = new Error(value.message)
                        e.name = value.error
                        throw e
                    }
                })
                // Recordの作成
                switch (mediaData.type) {
                    case "images":
                        Record = {
                            ...Record,
                            embed: {
                                $type: "app.bsky.embed.images",
                                images: resultUploadBlob.map(
                                    (value, index) => {
                                        return {
                                            image: value.blob,
                                            alt: mediaData.images[index].alt
                                        }
                                    }
                                )
                            }
                        }
                        break
                    case "external":
                        // 外部OGPがない場合はthumbはundefinedとする
                        Record = {
                            ...Record,
                            embed: {
                                $type: "app.bsky.embed.external",
                                external: {
                                    thumb: resultUploadBlob.length >= 1 ? resultUploadBlob[0].blob : undefined,
                                    uri: mediaData.meta.url,
                                    title: mediaData.meta.title,
                                    description: mediaData.meta.description
                                }
                            }
                        }
                        // Bluesky側Post本文にURLのリンクカードがない場合はintent宛に埋め込む
                        if (callbackPostPotions.postText.indexOf(mediaData.meta.url) < 0) {
                            callbackPostPotions.postText +=
                                `${postText !== "" ? ("\n") : ("")}${mediaData.meta.url}`
                        }
                        break
                }
            }
            setMsgInfo({
                msg: "Blueskyへポスト中...",
                isError: false
            })
            const createRecordResult = await createRecord({
                repo: session.did,
                accessJwt: session.accessJwt,
                record: Record,
            })
            if (typeof createRecordResult?.error !== "undefined") {
                let e: Error = new Error(createRecordResult.message)
                e.name = createRecordResult.error
                throw e
            }
            setMsgInfo({
                msg: "Blueskyへポストしました!",
                isError: false
            })
            // noGenerateではない場合かつ、添付メディアがimagesタイプの場合
            if (!options.noGenerateOgp &&
                ImageAttached && mediaData.type === "images") {
                setMsgInfo({
                    msg: "Twitter用ページ生成中...",
                    isError: false
                })
                const createPageResult = await createPage({
                    accessJwt: session.accessJwt,
                    uri: createRecordResult.uri
                })
                if (typeof createPageResult?.error !== "undefined") {
                    let e: Error = new Error(createPageResult.message)
                    e.name = createPageResult.error
                    throw e
                }
                setMsgInfo({
                    msg: "Twitter用リンクを生成しました!",
                    isError: false
                })
                const [id, rkey] = createPageResult.uri.split("/")
                const ogpUrl = new URL(
                    `${pagesPrefix}/${id}@${rkey}/`, siteurl)
                //　 本文に生成URLを付与
                callbackPostPotions.postText += `${postText !== "" ? ("\n") : ("")
                    }${ogpUrl.toString()}`
                // 生成URLからogpを取得
                const getOgpMetaResult = await getOgpMeta({
                    siteurl,
                    externalUrl: ogpUrl.toString(),
                    languageCode: language
                })
                if (getOgpMetaResult.type === "error") {
                    let e: Error = new Error(getOgpMetaResult.message)
                    e.name = getOgpMetaResult.error
                    throw e
                }
                callbackPostPotions.previewTitle = getOgpMetaResult.title
                if (getOgpMetaResult.image !== "") {
                    callbackPostPotions.previewData = await getOgpBlob({
                        siteurl,
                        externalUrl: getOgpMetaResult.image,
                        languageCode: language
                    })
                }
            }
            // 外部URLの場合は取得済みであろう内容を使用する
            if (mediaData !== null && mediaData.type === "external") {
                if (ImageAttached) {
                    const blob = mediaData.images[0].blob!
                    callbackPostPotions.previewData = blob
                }
                callbackPostPotions.previewTitle = mediaData.meta.title
            }
            callback(callbackPostPotions)
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
    }

    /**
     * Ctrl+Enterが押されたかどうかを判定します
     * @param e キーボードイベント
     * @returns Ctrl+Enterが押された場合true
     */
    const isCtrlEnterPressed: KeyPredicate = (e) => {
        if (e.key === "Enter") {
            if (isAssumedAsAppleProdUser) {
                return e.metaKey === true
            }
            return e.ctrlKey === true
        }
        return false
    }

    // Ctrl+Enterが押された場合に投稿する
    useKey(isCtrlEnterPressed, () => {
        handlePost().catch((e: unknown) => {
            const msg: string =
                e instanceof Error
                    ? `${e.name}: ${e.message}`
                    : "Unexpected Error@PostForm.tsx"
            setMsgInfo({
                msg: msg,
                isError: true,
            })
        })
    })

    return (
        <ProcButton
            buttonID="post"
            handler={handlePost}
            isProcessing={isProcessing}
            context={<span className={[
                "my-auto"
            ].join(" ")}>
                投稿
            </span>}
            color="blue"
            className={["my-0", "py-0.5", "align-middle"]}
            disabled={disabled} />
    )
}
export default Component