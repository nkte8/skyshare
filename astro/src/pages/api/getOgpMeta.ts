import type { APIContext, APIRoute } from "astro"
import type { ogpMetaData } from "@/lib/api/types"
import { corsAllowOrigin } from "@/lib/vars"
import validateRequestReturnURL from "@/lib/api/validateRequest"

import * as cheerio from "cheerio"

// SSRを有効化
export const prerender = false

const findEncoding = async (htmlBlob: Blob): Promise<string> => {
    const text = await htmlBlob.text()
    const headerRegExp: Array<RegExp> = [
        /(?: *< *meta +charset=["']?)([^"']*)["']?/i,
        /(?: *< *meta +http-equiv=["']?content-type["']? +content=["']?[^"']*charset=)([^"']*)["']?/i,
    ]

    let charset: string | undefined

    for (const filter of headerRegExp) {
        if (charset === undefined) {
            const regResult = filter.exec(text)
            if (regResult !== null) {
                charset = regResult[1]
            }
        }
    }
    charset = typeof charset !== "undefined" ? charset.toLowerCase() : "utf-8" // default

    return charset
}

/**
 * fetchしたHTMLのエスケープを解除
 * エスケープ文字はたくさんあるが、一旦Skyshareページで使用しているURLで対応が必要なものだけ処理実施
 *
 * @param {string} html 解除処理を行うHTML文字列
 */
const unescapeHtml = (html: string): string => {
    return html.replace("&amp;", "&").replace("&#38;", "&")
}

export const GET: APIRoute = async ({
    request,
}: APIContext): Promise<Response> => {
    // 返却するするヘッダ
    const headers = {
        "Access-Control-Allow-Origin": corsAllowOrigin,
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json",
    }
    // OPTIONSリクエストは即OK
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: headers,
        })
    }
    // APIの事前処理実施
    const validateResult = validateRequestReturnURL({ request })

    // エラーの場合はエラーレスポンスを返却
    if (validateResult.type === "error") {
        return new Response(JSON.stringify(validateResult), {
            status: validateResult.status,
            headers: headers,
        })
    }

    // 正常な場合はURLとして扱う
    const url: string = validateResult.decodedUrl
    const decodeAsText = async (arrayBuffer: Blob, encoding: string) =>
        new TextDecoder(encoding).decode(await arrayBuffer.arrayBuffer())

    let responseHTML: string = ""

    try {
        const htmlBlob: Blob = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": validateResult.language,
                "Cache-Control": "no-cache",
                "User-Agent": "bot",
            },
        })
            .then(res => res.blob())
            .catch((res: Error) => {
                const e: Error = new Error(res.message)
                e.name = res.name
                throw e
            })
        const encoding: string = await findEncoding(htmlBlob)
        const html: string = unescapeHtml(
            await decodeAsText(htmlBlob, encoding),
        )

        responseHTML = html

        const meta = extractHead({ html })

        const response = new Response(JSON.stringify(meta), {
            status: 200,
            headers: headers,
        })
        return response
    } catch (error: unknown) {
        let [name, msg]: string = "Unexpected Error"
        if (error instanceof Error) {
            name = error.name
            msg = error.message
        }
        // return new Response(JSON.stringify(<errorResponse>{
        return new Response(
            JSON.stringify({
                type: "error",
                error: name,
                message: msg,
                status: 500,
                html: responseHTML,
                // ogpResult: responseOGPResult,
            }),
            {
                status: 500,
                headers: headers,
            },
        )
    }
}

/**
 * HTML 文字列から OGP データを取得する
 *
 * @param {string} html 対象の HTML 文字列
 */
const extractHead = ({ html }: { html: string }): ogpMetaData => {
    const $ = cheerio.load(html)

    let title: string | undefined = undefined
    let description: string | undefined = undefined
    let image: string | undefined = undefined

    $("meta").each((_, element) => {
        const property = $(element).attr("property")
        const name = $(element).attr("name")
        const content = $(element).attr("content")
        const value = $(element).attr("value")

        if (typeof content === "undefined") {
            return
        }

        // twitter用メタを優先する
        if (
            typeof title === "undefined" &&
            typeof name !== "undefined" &&
            name.toLowerCase() === "twitter:title"
        ) {
            title = content || value
        }
        if (
            typeof description === "undefined" &&
            typeof name !== "undefined" &&
            name.toLowerCase() === "twitter:description"
        ) {
            description = content || value
        }
        if (
            typeof image === "undefined" &&
            typeof name !== "undefined" &&
            name.toLowerCase() === "twitter:image"
        ) {
            image = content || value
        }

        // OGメタを調べる
        if (
            typeof property !== "undefined" &&
            property.toLowerCase() === "og:title"
        ) {
            title = content || value
        }
        if (
            typeof property !== "undefined" &&
            property.toLowerCase() === "og:description"
        ) {
            description = content || value
        }
        if (
            typeof property !== "undefined" &&
            property.toLowerCase() === "og:image"
        ) {
            image = content || value
        }

        // メタが存在しない場合は直タグを調べるコード
        // 現時点ではこれに対応しない
        // if (
        //     typeof title === "undefined" &&
        //     typeof name !== "undefined" &&
        //     name.toLowerCase() === "title"
        // ) {
        //     title = content || value
        // }
        // if (
        //     typeof description === "undefined" &&
        //     typeof name !== "undefined" &&
        //     name.toLowerCase() === "description"
        // ) {
        //     description = content || value
        // }
    })

    return {
        type: "meta",
        title: typeof title !== "undefined" ? title : "",
        description: typeof description !== "undefined" ? description : "",
        image: typeof image !== "undefined" ? image : "",
    }
}
