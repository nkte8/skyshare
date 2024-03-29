import * as functions from 'firebase-functions/v2'
import errRes from '../errorResponse'
import getPostThread from "../atproto/getPostThread"
import compositeImages from "./compositeImages"
import { uploadOgp } from "./ogpUploader"
import { addOgbPageDB } from "./addPagedb"
import { domain, envName } from '../vars'

/**
 * この関数の入力となる形式
 * @param {string} uri OGPを作成するBluesky投稿のuri
 * @param {string} accessJwt アクセスシークレット
 */
type Input = {
    uri: string,
    accessJwt: string
}
/**
 * upstashに登録する情報
 * @param {string} ogp OGPイメージのリンク
 * @param {Array<object>} imgs イメージ情報のリスト
 * @param {string} imgs.thumb イメージのサムネイル情報
 * @param {string} imgs.alt イメージのalt情報
 */
type pagedb = {
    ogp: string,
    imgs: Array<{
        thumb: string,
        alt: string
    }>
}
namespace dev {
    let envName: envName = "dev"
    function checkInput(arg: any): arg is Input {
        return typeof arg.uri !== "undefined" &&
            typeof arg.accessJwt !== "undefined";
    }
    let cors_value: RegExp | string = "*"
    if (envName as envName === "prod") {
        cors_value = domain
    }
    export const ogpGenerator = functions.https.onRequest({
        region: 'asia-northeast1',
        cors: cors_value,
    }, async (
        request, response
    ) => {
        if (request.method === "OPTIONS") {
            response.status(204).send()
            return
        }
        if (request.method !== "POST") {
            response.status(405).send(errRes(405))
            return
        }

        const requestData: Input = request.body
        if (!checkInput(requestData)) {
            response.status(406).send(errRes(406))
            return
        }
        // リクエストでツイートを取得
        const resGetThread = await getPostThread({
            accessJwt: requestData.accessJwt,
            uri: requestData.uri
        })
        if (typeof resGetThread.error !== "undefined") {
            response.status(401).send(errRes(401))
            return
        }

        // リクエストからarrayBufferを取得
        const promImgsArrayBuffer: Array<Promise<ArrayBuffer>> = []
        resGetThread.thread.post.embed.images.forEach(async (value) => {
            promImgsArrayBuffer.push(
                fetch(
                    value.thumb
                ).then(res => res.arrayBuffer())
            )
        })
        const imgsArraybuffer = await Promise.all(promImgsArrayBuffer)
        // ArrayBufferをBufferへ変換
        let imgsBuffer: Array<Buffer> = []
        imgsArraybuffer.forEach((value) => {
            imgsBuffer.push(Buffer.from(value))
        })
        // ogpをジェネレート
        const ogpBuffer = compositeImages(imgsBuffer)
        // アップロード
        const postRkey = resGetThread.thread.post.uri.split("/").at(-1)!
        const ogpFilename = `${resGetThread.thread.post.author.handle}/${postRkey}`
        const dbKey = `${resGetThread.thread.post.author.handle}@${postRkey}`
        const ogpUrl = uploadOgp({
            env: envName,
            ogpFilename: ogpFilename,
            ogpBuffer: await ogpBuffer
        })

        const resPagedbAdd = await addOgbPageDB<pagedb>({
            env: envName,
            keyName: dbKey,
            dbData: {
                ogp: await ogpUrl,
                imgs: resGetThread.thread.post.embed.images
            },
        })
        if (resPagedbAdd === null) {
            response.status(500).send(errRes(500))
            return
        }
        if (typeof resPagedbAdd.result === "undefined") {
            response.status(502).send(errRes(502))
            return
        }
        response.status(200).send({
            uri: ogpFilename
        });
        response.end();
    });
}
export default dev
