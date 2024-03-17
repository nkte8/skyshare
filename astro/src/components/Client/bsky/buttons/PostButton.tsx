import { useContext, Dispatch, SetStateAction } from "react"
import { MediaData } from "../type"
import { msgInfo, popupContent } from "../../common/types"
import { servicename, pagesPrefix } from "@/utils/vars"

import { Session_context } from "../../common/contexts"
import ProcButton from "../../common/ProcButton"

import { label } from "@/utils/atproto_api/labels";
import detectFacets from "@/utils/atproto_api/detectFacets";
import createRecord from "@/utils/atproto_api/createRecord";
import type record from "@/utils/atproto_api/record";
import { richTextFacetParser } from "@/utils/richTextParser"
import { compressImage } from "@/utils/compressimage"

import createPage from "@/utils/backend_api/createPage";
import uploadBlob, { type uploadBlobResult } from "@/utils/atproto_api/uploadBlob";

import { setSavedTags, readSavedTags } from "@/utils/localstorage";

export const Component = ({
    postText,
    language,
    selfLabel,
    options,
    mediaDataList,
    callback,
    isProcessing,
    setProcessing,
    setMsgInfo,
    disabled,
}: {
    postText: string,
    language: Array<string>,
    selfLabel: label.value | null,
    options: {
        appendVia: boolean
        noGenerateOgp: boolean
        // autoPopup: boolean
    },
    mediaDataList: MediaData | null,
    callback: (options: {
        popupContent: popupContent
    }) => void,
    isProcessing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
    disabled: boolean
}) => {
    // セッション
    const { session } = useContext(Session_context)
    // 保存できるタグの上限
    const maxTagCount = 8

    const handlePost = async () => {
        const isValidPost = (): boolean => {
            let result: boolean = postText.length >= 1
            if (mediaDataList !== null) {
                result = result || mediaDataList.blobs.length > 0
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
            const facets = await detectFacets({ text: postText })
            // 今後公式APIを使うことを考慮し、recordBuilder.tsの利用を終了
            let Record: record = {
                text: postText,
                createdAt: new Date(),
                langs: language,
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

            const savedTag = readSavedTags()
            let taglist: string[] = (savedTag !== null) ? savedTag : []
            parseResult.forEach((value) => {
                const tagName = `#${value}`
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

            // intent向けに発行する情報
            let popupContent: popupContent = {
                url: null,
                content: postText
            }
            // 投稿の文字制限を解除（API側に処理させる）
            // また、ツリー投稿機能の実装の際は分割方法を検討すること

            const noImagesAttached = (
                mediaDataList === null || mediaDataList.blobs.length <= 0
            )
            // uploadBlobを行なった場合は結果が格納される
            let resultUploadBlob: Array<uploadBlobResult> = []

            // メディアデータが存在する場合はRecordに対して特定の処理を行う
            if (!noImagesAttached) {
                // メディアのデータを圧縮
                let compressTasks: Array<Promise<ArrayBuffer>> = []
                mediaDataList.blobs.forEach((value, index) => {
                    if (value.blob !== null) {
                        const file: File = new File(
                            [value.blob],
                            `media${index}.data`,
                            { type: value.blob.type })
                        compressTasks.push(
                            compressImage(file).then(
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
                switch (mediaDataList.type) {
                    case "images":
                        Record = {
                            ...Record,
                            embed: {
                                $type: "app.bsky.embed.images",
                                images: resultUploadBlob.map(
                                    (value, index) => {
                                        return {
                                            image: value.blob,
                                            alt: mediaDataList.blobs[index].alt
                                        }
                                    }
                                )
                            }
                        }
                        break
                    case "external":
                        Record = {
                            ...Record,
                            embed: {
                                $type: "app.bsky.embed.external",
                                external: {
                                    thumb: resultUploadBlob[0].blob,
                                    uri: mediaDataList.meta.url,
                                    title: mediaDataList.meta.title,
                                    description: mediaDataList.meta.description
                                }
                            }
                        }
                        break
                }
                // linkcardの場合はurlを設定する
                if (mediaDataList.type === "external") {
                    popupContent.url = new URL(mediaDataList.meta.url)
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
            // noGenerateの場合はTwitter用ページは生成しない
            if (!options.noGenerateOgp && !noImagesAttached) {
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
                const ogpUrl = new URL(`${pagesPrefix}/${id}@${rkey}/`, 'relative:///')
                popupContent.url = ogpUrl
                popupContent.content += `${popupContent.content !== "" ? ("\n") : ("")}${ogpUrl.toString()}`
            }
            callback({
                popupContent
            })
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
    return (
        <ProcButton
            buttonID="post"
            handler={handlePost}
            isProcessing={isProcessing}
            context="Post"
            color="blue"
            className={["my-0", "py-0.5"].join(" ")}
            disabled={disabled} />
    )
}
export default Component