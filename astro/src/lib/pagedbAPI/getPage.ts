import { z } from "zod"
import etype from "./models/error.json"
const endpoint_url = import.meta.env.PUBLIC_GETPAGES_ENDPOINT as string
const object = "page"

export const PageFetchOutputZod = z.object({
    ogp: z.string(),
    imgs: z.array(
        z.object({
            thumb: z.string(),
            alt: z.string(),
        }),
    ),
})
export type pageFetchOutput = z.infer<typeof PageFetchOutputZod>

export const api = async ({
    id,
}: {
    id: string
}): Promise<pageFetchOutput | typeof etype> => {
    const url = new URL(object + "/" + encodeURIComponent(id), endpoint_url)
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            const responseParsed = PageFetchOutputZod.safeParse(response.json())

            if (!responseParsed.success) {
                const e: Error = new Error(
                    "Unexpected Response Type@getPages::api",
                )
                e.name = "Unexpected Response Type@getPages::api"
                throw e
            }

            const apiResult: pageFetchOutput = responseParsed.data
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
