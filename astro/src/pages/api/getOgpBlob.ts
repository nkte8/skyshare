import type { APIContext, APIRoute } from "astro";
import validateRequestReturnURL from "@/lib/validateRequest"
import createErrResponse from "@/lib/createErrResponse";
import { corsAllowOrigin } from "@/utils/envs";
// SSRを有効化
export const prerender = false;

export const GET: APIRoute = async ({ request }: APIContext) => {

    // CORSの設定
    const corsHeaders = {
        "Access-Control-Allow-Origin": corsAllowOrigin,
        "Access-Control-Allow-Methods": "GET,OPTIONS"
    }
    // APIの事前処理実施
    const validateResult: string | Response = validateRequestReturnURL({ request })

    // エラーの場合はエラーレスポンスを返却
    if (typeof validateResult !== "string") {
        for (const [key, value] of Object.entries(corsHeaders)) {
            validateResult.headers.append(key, value)
        }
        validateResult.headers.append("Content-Type", "application/json")
        return validateResult
    }

    // 正常な場合はURLとして扱う
    const url: string = validateResult
    try {
        const blob: Blob = await fetch(url).then((res) => res.blob());
        const response: Response = new Response(blob, {
            status: 200,
            headers: corsHeaders
        });
        response.headers.append("Content-Type", blob.type)
        return response;
    } catch (error: unknown) {
        const result: Response = createErrResponse({
            statusCode: 500
        })
        for (const [key, value] of Object.entries(corsHeaders)) {
            result.headers.append(key, value)
        }
        result.headers.append("Content-Type", "application/json")
        return result
    }
};
