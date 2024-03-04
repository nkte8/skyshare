import createErrResponse from "./createErrResponse";

const protocol_validation: RegExp = /(dict|file|ftp|gopher|ldap|smtp|telnet|tftp):\/\//
const loopback_validation: RegExp = /localhost/
const ipv4_validation: RegExp = /(?:\d{0,3}\.){3}\d{0,3}/
const ipv6_validation: RegExp = /\[[0-9a-fA-F:]+\]/

/**
 * デコード済みURLを返します。リクエストに問題がある場合はエラーレスポンスを返します。
 * @param request リクエスト
 * @returns デコード済みURL または エラーレスポンス
 */
const validateRequestReturnURL = ({
    request
}: {
    request: Request
}): string | Response => {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            // headers: corsHeaders
        })
    }
    // GET以外はerror型で返却する
    if (request.method !== "GET") {
        return createErrResponse({
            statusCode: 405,
        })
    }

    const url = new URL(request.url).searchParams.get("url");
    if (url === null) {
        return createErrResponse({
            statusCode: 406,
        })
    }

    const decodedUrl = decodeURIComponent(url)
    // SSRF対策
    if (
        protocol_validation.test(decodedUrl) ||
        loopback_validation.test(decodedUrl) ||
        ipv4_validation.test(decodedUrl) ||
        ipv6_validation.test(decodedUrl)
    ) {
        return createErrResponse({
            statusCode: 502,
        })
    }

    return decodedUrl
}
export default validateRequestReturnURL
