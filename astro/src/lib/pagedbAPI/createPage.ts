import { z } from "zod"
import etype from "./models/error.json"

const endpoint_url = import.meta.env.PUBLIC_CREATEPAGES_ENDPOINT as string

const PageCreationOutputZod = z.object({
    uri: z.string(),
})
export type pageCreationOutput = z.infer<typeof PageCreationOutputZod>

/**
 * pageDBへページを追加
 *
 * @param {Object} props
 * @param {string} props.uri 元投稿のuri
 * @param {string} props.accessJwt アクセストークン
 */
export const api = async ({
    uri,
    accessJwt,
}: {
    uri: string
    accessJwt: string
}): Promise<pageCreationOutput | typeof etype> => {
    return fetch(endpoint_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uri: uri,
            accessJwt: accessJwt,
        }),
    })
        .then(response => {
            const responseParsed = PageCreationOutputZod.safeParse(
                response.json(),
            )
            if (!responseParsed.success) {
                const e: Error = new Error(
                    "Unexpected Response Type@createPage::api",
                )
                e.name = "Unexpected Response Type@createPage::api"
                throw e
            }
            const apiResult: pageCreationOutput = responseParsed.data
            return apiResult
        })
        .catch((e: Error) => {
            return {
                error: e.name,
                message: e.message,
            }
        })
}

export default api
