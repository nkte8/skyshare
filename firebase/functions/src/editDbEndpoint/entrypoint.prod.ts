import * as functions from 'firebase-functions/v2'
import errRes from '../errorResponse'
import getSession from "../atproto/getSession"
import getPostThread from "../atproto/getPostThread"
import type modelGetSession from "../atproto/models/getSession.json"
import type modelGetPostThread from "../atproto/models/getPostThread.json"
import { delOgbPageDB } from "./delPagedb"

import { app_bsky } from '../atproto/base'
import modelInput from "./models/Input.json"
import { domain } from '../vars'
type Input = typeof modelInput

export namespace prod {
    let envName: "dev" | "prod" = "prod"
    function checkInput(arg: any): arg is Input {
        return typeof arg.id !== "undefined" &&
            typeof arg.did !== "undefined" &&
            typeof arg.accessJwt !== "undefined";
    }
    let cors_value: RegExp | string = "*"
    if (envName as "dev" | "prod" === "prod") {
        cors_value = domain
    }
    export const editDbEndpoint = functions.https.onRequest({
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

        const rkeyFromId = requestData.id.split(/(_|@)/).at(-1)
        const handleFromId = requestData.id.split(/(_|@)/).at(0)
        const uri = `at://${requestData.did}/${app_bsky.feed.post}/${rkeyFromId}`


        let resPromise: Array<Promise<any>> = []

        // トークンのセッション情報の取得を予約
        resPromise.push(
            getSession({
                accessJwt: requestData.accessJwt,
            })
        )
        // 削除予定の投稿の情報取得を予約
        resPromise.push(
            getPostThread({
                accessJwt: requestData.accessJwt,
                uri: uri
            }))
        // APIから情報を取得
        const resAPI = await Promise.all(resPromise)
        let isError: boolean = false
        let resGetSession: typeof modelGetSession = null!
        let resPostThread: typeof modelGetPostThread = null!
        // チェック
        resAPI.forEach((value) => {
            // いずれかがerror型の場合は問答無用でreject
            if (typeof value?.error !== "undefined") {
                response.status(401).send(errRes(401))
                isError = true
                return
            }
            if (typeof value?.thread !== "undefined") {
                resPostThread = value
            }
            if (typeof value?.did !== "undefined") {
                resGetSession = value
            }
        })
        if (isError) {
            return
        }
        // requestのdidとセッションのdidが不一致の場合はreject
        if (resGetSession.did !== requestData.did) {
            response.status(406).send(errRes(406))
            return
        }
        // pageに登録済みのhandleと作成元の投稿のhandleが一致しない場合はreject
        if (resPostThread.thread.post.author.handle !== handleFromId) {
            response.status(401).send(errRes(401))
            return
        }

        // ページを消してよい
        const resPagedbdel = await delOgbPageDB({
            env: envName,
            keyName: requestData.id,
        })

        if (resPagedbdel === null) {
            response.status(500).send(errRes(500))
            return
        }
        if (typeof resPagedbdel.result === "undefined") {
            response.status(502).send(errRes(502))
            return
        }
        // 正常に削除完了
        response.status(200).send({
            result: "ok"
        });
        response.end();
    });
}
export default prod
