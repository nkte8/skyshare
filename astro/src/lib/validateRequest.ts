import createErrResponse from "./createErrResponse";
import { isNotProduction } from "@/utils/envs"
import { apiRequest, errorResponse } from "./types";

const protocol_validation: RegExp = /(dict|file|ftp|gopher|ldap|smtp|telnet|tftp):\/\//
const loopback_validation: RegExp = /localhost/
const ipv4_validation: RegExp = /(?:\d{0,3}\.){3}\d{0,3}/
const ipv6_validation: RegExp = /\[[0-9a-fA-F:]+\]/

/**
 * apiResponseを返します。リクエストに問題がある場合はエラーレスポンスを返します。
 * @param request リクエスト
 * @returns apiResponse または エラーレスポンス
 */
const validateRequestReturnURL = ({
    request
}: {
    request: Request
}): apiRequest | errorResponse => {
    // GET以外はerror型で返却する
    if (request.method !== "GET") {
        return createErrResponse({
            statusCode: 405,
        })
    }

    const url = new URL(request.url).searchParams.get("url");
    const lang = new URL(request.url).searchParams.get("lang");
    if (url === null) {
        return createErrResponse({
            statusCode: 406,
        })
    }
    if (lang === null) {
        return createErrResponse({
            statusCode: 406,
        })
    }
    const decodedUrl = decodeURIComponent(url)
    // SSRF対策
    // Productionではない環境についてはlocalhostの実行を許可
    const validation = !isNotProduction ? (
        // Productionの場合は厳格なルールを指定
        protocol_validation.test(decodedUrl) ||
        loopback_validation.test(decodedUrl) ||
        ipv4_validation.test(decodedUrl) ||
        ipv6_validation.test(decodedUrl)
    ) : (
        // Not Productionの場合は(Cloudflare Zero Trustといった)
        // 低レイヤー対策前提でlocalhostを許可
        protocol_validation.test(decodedUrl)
    )
    if (validation) {
        return createErrResponse({
            statusCode: 502,
        })
    }

    return <apiRequest>{
        type: "api",
        decodedUrl: decodedUrl,
        language: lang
    }
}
export default validateRequestReturnURL
