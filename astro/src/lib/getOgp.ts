import type { errorResponse, ogpMetaData } from "@/lib/api/types"
import { ZodErrorResponse, ZodOgpMetaData } from "@/lib/api/types"

// note: エラー規格を型定義として決めた方がいい（ error@Component: message とするなど）
export const getOgpMeta = async ({
    siteurl,
    externalUrl,
    languageCode,
}: {
    siteurl: string
    externalUrl: string
    languageCode: string
}): Promise<ogpMetaData | errorResponse> => {
    const apiUrl = new URL("/api/getOgpMeta", siteurl)
    apiUrl.searchParams.append("url", encodeURIComponent(externalUrl))
    apiUrl.searchParams.append("lang", languageCode)
    return await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept-Language": languageCode,
            "Cache-Control": "no-cache",
        },
    })
        .then(async response => {
            const jsonResponse: unknown = await response.json()
            const responseParsedAsError =
                ZodErrorResponse.safeParse(jsonResponse)
            const responseParsedAsOgpMetaData =
                ZodOgpMetaData.safeParse(jsonResponse)

            if (!(response.ok && responseParsedAsOgpMetaData.success)) {
                const e: Error = new Error(
                    responseParsedAsError.success
                        ? responseParsedAsError.data.message
                        : "Unexpected Response Type@getOgpMeta",
                )
                e.name = responseParsedAsError.success
                    ? responseParsedAsError.data.error
                    : "Unexpected Response Type"
                throw e
            }

            return responseParsedAsOgpMetaData.data
        })
        .catch((e: Error) => {
            return {
                type: "error",
                error: `${e.name}@getOgpMeta`,
                message: e.message,
                status: 500,
            }
        })
}
// Blob型はユニオン型として扱うことが難しいため、エラーハンドリングできない
export const getOgpBlob = async ({
    siteurl,
    externalUrl,
    languageCode,
}: {
    siteurl: string
    externalUrl: string
    languageCode: string
}): Promise<Blob> => {
    const apiUrl = new URL("/api/getOgpBlob", siteurl)
    apiUrl.searchParams.append("url", encodeURIComponent(externalUrl))
    apiUrl.searchParams.append("lang", languageCode)
    return await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Accept-Language": languageCode,
            "Cache-Control": "no-cache",
        },
    }).then(async response => {
        if (!response.ok) {
            const responseParsedAsError = ZodErrorResponse.safeParse(
                response.json(),
            )
            const e: Error = new Error(
                responseParsedAsError.success
                    ? responseParsedAsError.data.message
                    : "Unexpected Response Type@getOgpBlob",
            )
            e.name = `${
                responseParsedAsError.success
                    ? responseParsedAsError.data.error
                    : "Unexpected Response Type"
            }@getOgpBlob`
            throw e
        }
        const result: Blob = await response.blob()
        const ContentType = response.headers.get("Content-Type")
        const MimeType =
            result.type !== ""
                ? result.type
                : ContentType !== null
                  ? ContentType
                  : "image/png"
        return new Blob([result], { type: MimeType })
    })
}
