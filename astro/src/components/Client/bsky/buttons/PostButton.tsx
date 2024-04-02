// utils
import { useContext, Dispatch, SetStateAction } from "react"
import { useKey } from "react-use"
import type { KeyPredicate } from "react-use/lib/useKey"

// components
import { Session_context } from "../../common/contexts"
import ProcButton from "../../common/ProcButton"

// atproto
import { label } from "@/utils/atproto_api/labels"
import detectFacets from "@/utils/atproto_api/detectFacets"
import createRecord from "@/utils/atproto_api/createRecord"
import type record from "@/utils/atproto_api/record"
import uploadBlob, {
    type uploadBlobResult,
} from "@/utils/atproto_api/uploadBlob"
import resolveHandle, {
    type resolveHandleResult,
} from "@/utils/atproto_api/resolveHandle"

// backend api
import createPage from "@/lib/pagedbAPI/createPage"
import browserImageCompression from "@/utils/browserImageCompression"
import { getOgpBlob, getOgpMeta } from "@/lib/getOgp"

// service
import { callbackPostOptions } from "../PostForm"
import { msgInfo, MediaData } from "../../common/types"
import { servicename } from "@/env/vars"
import { pagesPrefix } from "@/env/envs"
import saveTagToSavedTags from "../lib/saveTagList"
import { richTextFacetParser } from "@/utils/richTextParser"
import { bskyProfileURL } from "@/env/bsky"

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
    postText: string
    language: string
    selfLabel: label.value | null
    options: {
        appendVia: boolean
        noGenerateOgp: boolean
        // autoPopup: boolean
    }
    mediaData: MediaData | null
    callback: (options: callbackPostOptions) => void
    isProcessing: boolean
    setProcessing: Dispatch<SetStateAction<boolean>>
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>
    disabled: boolean
}) => {
    // 配置されたサイトのURL
    const siteurl = location.origin
    // セッション
    const { session } = useContext(Session_context)
    /** Apple製品利用者の可能性がある場合True */
    const isAssumedAsAppleProdUser = navigator.userAgent
        .toLowerCase()
        .includes("mac os x")

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
                isError: true,
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
            isError: false,
        })
        try {
            // プレビューへ送るテキストを別途初期化
            const callbackPostOptions: callbackPostOptions = {
                postText,
                previewTitle: null,
                previewData: null,
            }
            // facetを取得
            const facets = await detectFacets({ text: postText })
            // 今後公式APIを使うことを考慮し、recordBuilder.tsの利用を終了
            let Record: record = {
                text: postText,
                createdAt: new Date(),
                langs: [language],
                $type: "app.bsky.feed.post",
                labels:
                    selfLabel !== null
                        ? {
                            $type: "com.atproto.label.defs#selfLabels",
                            values: [selfLabel],
                        }
                        : undefined,
                via: options.appendVia !== false ? servicename : undefined,
                facets: facets.length > 0 ? facets : undefined,
            }

            // ポストにタグが含まれる場合は保存
            saveTagToSavedTags({ postText })

            // 投稿の文字制限を解除（API側に処理させる）
            // また、ツリー投稿機能の実装の際は分割方法を検討すること

            // intent投稿側の表示をURLにする機能の実装
            // mentionを検出
            const richTextLinkParser = new richTextFacetParser("mention")
            const parseResult = richTextLinkParser.getFacet(postText)

            // facetを参照せず、再度取得
            const resolveHandleTasks: Array<Promise<resolveHandleResult>> = []
            parseResult.forEach(value => {
                const mentionHandle = value
                resolveHandleTasks.push(
                    resolveHandle({
                        handle: mentionHandle.slice(1),
                    }),
                )
            })
            const resultResolveHandle = await Promise.allSettled(
                resolveHandleTasks,
            ).then(values => {
                const result: Array<resolveHandleResult | null> = []
                values.forEach(value => {
                    if (value.status !== "rejected") {
                        result.push(value.value)
                        value.value
                    } else {
                        result.push(null)
                    }
                })
                return result
            })
            // didが取得できた項目に関して置き換え処理
            resultResolveHandle.forEach((value, index) => {
                const mentionHandle = parseResult[index]
                const callbackPostText = callbackPostOptions.postText
                if (value !== null) {
                    callbackPostOptions.postText = callbackPostText.replace(
                        mentionHandle,
                        new URL(
                            mentionHandle.slice(1),
                            bskyProfileURL,
                        ).toString(),
                    )
                    console.log(callbackPostOptions.postText)
                }
            })

            const ImageAttached =
                mediaData !== null &&
                mediaData.images.length > 0 &&
                mediaData.images[0].blob !== null
            // uploadBlobを行なった場合は結果が格納される
            let resultUploadBlob: Array<uploadBlobResult> = []

            // メディアデータが存在する場合はRecordに対して特定の処理を行う
            if (ImageAttached) {
                // メディアのデータを圧縮
                const compressTasks: Array<Promise<ArrayBuffer>> = []
                mediaData.images.forEach((value, index) => {
                    if (value.blob !== null) {
                        const file: File = new File(
                            [value.blob],
                            `media${index}.data`,
                            { type: value.blob.type },
                        )
                        compressTasks.push(
                            browserImageCompression(file).then(
                                async value => await value.arrayBuffer(),
                            ),
                        )
                    }
                })
                // compressを並列処理
                const resultCompress: Array<ArrayBuffer> = await Promise.all(
                    compressTasks,
                ).then(values => {
                    return values
                })
                const uploadBlobTasks: Array<Promise<uploadBlobResult>> = []
                resultCompress.forEach(value => {
                    uploadBlobTasks.push(
                        uploadBlob({
                            accessJwt: session.accessJwt,
                            mimeType: "image/jpeg",
                            blob: new Uint8Array(value),
                        }),
                    )
                })
                // uploadBlobを並列処理
                resultUploadBlob = await Promise.all(uploadBlobTasks).then(
                    values => {
                        return values
                    },
                )
                // Blobのアップロードに失敗したファイルが一つでも存在した場合停止する
                resultUploadBlob.forEach(value => {
                    if (typeof value?.error !== "undefined") {
                        const e: Error = new Error(value.message)
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
                                images: resultUploadBlob.map((value, index) => {
                                    return {
                                        image: value.blob,
                                        alt: mediaData.images[index].alt,
                                    }
                                }),
                            },
                        }
                        break
                    case "external":
                        // 外部OGPがない場合はthumbはundefinedとする
                        Record = {
                            ...Record,
                            embed: {
                                $type: "app.bsky.embed.external",
                                external: {
                                    thumb:
                                        resultUploadBlob.length >= 1
                                            ? resultUploadBlob[0].blob
                                            : undefined,
                                    uri: mediaData.meta.url,
                                    title: mediaData.meta.title,
                                    description: mediaData.meta.description,
                                },
                            },
                        }
                        // Bluesky側Post本文にURLのリンクカードがない場合はintent宛に埋め込む
                        if (
                            callbackPostOptions.postText.indexOf(
                                mediaData.meta.url,
                            ) < 0
                        ) {
                            callbackPostOptions.postText += `${postText !== "" ? "\n" : ""}${mediaData.meta.url}`
                        }
                        break
                }
            }
            setMsgInfo({
                msg: "Blueskyへポスト中...",
                isError: false,
            })
            const createRecordResult = await createRecord({
                repo: session.did,
                accessJwt: session.accessJwt,
                record: Record,
            })
            if (typeof createRecordResult?.error !== "undefined") {
                const e: Error = new Error(createRecordResult.message)
                e.name = createRecordResult.error
                throw e
            }
            setMsgInfo({
                msg: "Blueskyへポストしました!",
                isError: false,
            })
            // noGenerateではない場合かつ、添付メディアがimagesタイプの場合
            if (
                !options.noGenerateOgp &&
                ImageAttached &&
                mediaData.type === "images"
            ) {
                setMsgInfo({
                    msg: "Twitter用ページ生成中...",
                    isError: false,
                })
                const createPageResult = await createPage({
                    accessJwt: session.accessJwt,
                    uri: createRecordResult.uri,
                })
                if (typeof createPageResult?.error !== "undefined") {
                    const e: Error = new Error(createPageResult.message)
                    e.name = createPageResult.error
                    throw e
                }
                setMsgInfo({
                    msg: "Twitter用リンクを生成しました!",
                    isError: false,
                })
                const [id, rkey] = createPageResult.uri.split("/")
                const ogpUrl = new URL(`${pagesPrefix}/${id}@${rkey}/`, siteurl)
                // 本文に生成URLを付与
                callbackPostOptions.postText += `${
                    postText !== "" ? "\n" : ""
                }${ogpUrl.toString()}`
                // 生成URLからogpを取得
                const getOgpMetaResult = await getOgpMeta({
                    siteurl,
                    externalUrl: ogpUrl.toString(),
                    languageCode: language,
                })
                if (getOgpMetaResult.type === "error") {
                    const e: Error = new Error(getOgpMetaResult.message)
                    e.name = getOgpMetaResult.error
                    throw e
                }
                callbackPostOptions.previewTitle = getOgpMetaResult.title
                if (getOgpMetaResult.image !== "") {
                    callbackPostOptions.previewData = await getOgpBlob({
                        siteurl,
                        externalUrl: getOgpMetaResult.image,
                        languageCode: language,
                    })
                }
            }
            // 外部URLの場合は取得済みであろう内容を使用する
            if (mediaData !== null && mediaData.type === "external") {
                if (ImageAttached) {
                    const blob = mediaData.images[0].blob!
                    callbackPostOptions.previewData = blob
                }
                callbackPostOptions.previewTitle = mediaData.meta.title
            }
            // callbackを起動
            callback(callbackPostOptions)
        } catch (error: unknown) {
            let msg: string = "Unexpected Unknown Error"
            if (error instanceof Error) {
                msg = error.name + ": " + error.message
            }
            setMsgInfo({
                msg: msg,
                isError: true,
            })
        }
        setProcessing(false)
    }

    /**
     * Ctrl+Enterが押されたかどうかを判定します
     * @param e キーボードイベント
     * @returns Ctrl+Enterが押された場合true
     */
    const isCtrlEnterPressed: KeyPredicate = e => {
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
            context={<span className={["my-auto"].join(" ")}>投稿</span>}
            color="blue"
            className={["my-0", "py-0.5", "align-middle"]}
            disabled={disabled}
        />
    )
}
export default Component
