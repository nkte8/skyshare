import type { APIContext, APIRoute } from "astro";
import validateRequestReturnURL from "@/lib/validateRequest"
import createErrResponse from "@/lib/createErrResponse";
import { corsAllowOrigin } from "@/utils/envs";
import { errorResponse } from "@/lib/types";
// SSRを有効化
export const prerender = false;

export const GET: APIRoute = async ({ request }: APIContext) => {

    // CORSの設定
    const headers = {
        "Access-Control-Allow-Origin": corsAllowOrigin,
        "Access-Control-Allow-Methods": "GET,OPTIONS"
    }
    // error用のheader
    const errorheaders = {
        ...headers,
        "Content-Type": "application/json"
    }

    // APIの事前処理実施
    // OPTIONSリクエストは即OK
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: headers
        })
    }
    // APIの事前処理実施
    const validateResult = validateRequestReturnURL({ request })

    // エラーの場合はエラーレスポンスを返却
    if (validateResult.type === "error") {
        return new Response(JSON.stringify(validateResult), {
            status: validateResult.status,
            headers: errorheaders
        })
    }

    // 正常な場合はURLとして扱う
    const url: string = validateResult.decodedUrl
    try {
        const blob: Blob = await fetch(url, {
            method: 'GET',
            headers: {
                "Accept-Language": validateResult.language,
                "User-Agent": "node",
                "Cache-Control": "no-cache",
            }
        }).then((res) => res.blob());
        const response: Response = new Response(blob, {
            status: 200,
            headers: headers
        });
        response.headers.append("Content-Type", blob.type)
        return response;
    } catch (error: unknown) {
        const result: errorResponse = createErrResponse({
            statusCode: 500
        })
        return new Response(JSON.stringify(result), {
            status: result.status,
            headers: errorheaders
        })
    }
};
