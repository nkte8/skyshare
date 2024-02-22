import detectFacets from "./atproto_api/detectFacets";
import facet from "./atproto_api/facets"
import embed from "./atproto_api/embeds"

import uploadBlob from "./atproto_api/uploadBlob";
import model_uploadBlob from "./atproto_api/models/uploadBlob.json";
import model_error from "./atproto_api/models/error.json";

import getOgp from "./getOgp"
import getMeta, { ogpMeta } from "./getMeta"

export type SessionNecessary = {
    did: string,
    accessJwt: string,
}
// 最低限必要なレコード
type RecordBase = {
    text: string,
    createdAt: Date,
    $type: "app.bsky.feed.post",
    langs: Array<string>
}
// 付与できる情報を定義
type RecordCore = {
    facets?: Array<facet.link | facet.mention>
    embed?: embed.images | embed.external
} & RecordBase

export const buildRecordBase = async (props: RecordBase): Promise<RecordCore> => {
    let recordResult: RecordCore = props
    const facets = await detectFacets({ text: props.text })
    if (facets.length > 0) {
        recordResult = {
            ...props,
            facets: facets
        }
    }
    return recordResult
}

export const attachExternalToRecord = async ({
    base,
    session,
    externalUrl,
    handleProcessing
}: {
    base: RecordBase,
    session: SessionNecessary,
    externalUrl: URL,
    handleProcessing: ({
        msg, isError
    }: {
        msg: string, isError: boolean
    }) => void
}): Promise<RecordCore> => {
    let recordResult: RecordCore = base
    let html: string | null = null
    let ogpUrl: string | null = null
    let ogpMeta: ogpMeta = {
        title: "",
        description: ""
    }
    let blob: Blob | null = null

    try {
        html = await fetch(externalUrl).then((text) => text.text())
        if (html !== null) {
            ogpUrl = getOgp({ content: html })
            ogpMeta = getMeta({ content: html })
            handleProcessing({
                msg: `${externalUrl.hostname}からOGPの取得中...`,
                isError: false
            })
            blob = await fetch(ogpUrl).then(res => res.blob())
        }
    } catch (error: unknown) {
        // failed to fetchの場合、リンクカードを付与しない。
        handleProcessing({
            msg: `OGPカードの取得に失敗しました。`,
            isError: true
        })
    }
    if (blob !== null) {
        // リンク先のOGPからblobを作成し、mimeTypeの設定&バイナリのアップロードを実施
        handleProcessing({
            msg: `画像のアップロード中...`,
            isError: false
        })
        const resultUploadBlobs = await uploadBlob({
            accessJwt: session.accessJwt,
            mimeType: blob.type,
            blob: new Uint8Array(await blob.arrayBuffer())
        })
        // 例外処理
        if (typeof resultUploadBlobs?.error !== "undefined") {
            let e: Error = new Error(resultUploadBlobs.message)
            e.name = resultUploadBlobs.error
            throw e
        }

        // embedを追加
        let embed: embed.external = {
            $type: "app.bsky.embed.external",
            external: {
                uri: externalUrl.toString(),
                title: ogpMeta.title,
                description: ogpMeta.description,
                thumb: resultUploadBlobs.blob,
            }
        }
        recordResult = {
            ...base,
            embed
        }
    }
    return recordResult
}

export const attachImageToRecord = async ({
    base,
    session,
    imageFiles,
    handleProcessing,
    altTexts,
}: {
    base: RecordBase,
    session: SessionNecessary,
    imageFiles: Array<File>,
    handleProcessing: ({
        msg, isError
    }: {
        msg: string, isError: boolean
    }) => void
    altTexts: Array<string>
}): Promise<RecordCore> => {
    let recordResult: RecordCore = base
    let queUploadBlob: Array<Promise<typeof model_uploadBlob & typeof model_error>> = []
    for (let file of imageFiles) {
        queUploadBlob.push(uploadBlob({
            accessJwt: session!.accessJwt,
            mimeType: file.type,
            blob: new Uint8Array(await file.arrayBuffer())
        }))
    }
    handleProcessing({
        msg: `画像のアップロード中...`,
        isError: false
    })
    // 戻り配列の順序を固定
    const resultUploadBlobs = 
        await Promise.all(queUploadBlob).then(
        (values) => {
            return values
        })

    // 画像アップロードに失敗したファイルが一つでも存在した場合停止する
    resultUploadBlobs.forEach((value) => {
        if (typeof value?.error !== "undefined") {
            let e: Error = new Error(value.message)
            e.name = value.error
            throw e
        }
    })

    // embedを追加
    let embed: embed.images = {
        $type: "app.bsky.embed.images",
        images: []
    }
    resultUploadBlobs.forEach((value, index) => {
        embed.images.push({
            image: value.blob,
            alt: altTexts[index],
        })
    })
    recordResult = {
        ...base,
        embed
    }
    return recordResult
}