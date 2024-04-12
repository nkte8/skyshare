import { z } from "zod"
import etype from "./models/error.json"
const endpoint_url = import.meta.env.PUBLIC_GETPAGES_ENDPOINT as string
const object = "user"

const ZodIdsFetchOutput = z.object({
    ids: z.array(z.string()),
})
export type idsFetchOutput = {
    ids: Array<string>
}

export const api = async ({
    handle,
}: {
    handle: string
}): Promise<idsFetchOutput | typeof etype> => {
    const url = new URL(object + "/" + encodeURIComponent(handle), endpoint_url)
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async response => {
            const responseParsed = ZodIdsFetchOutput.safeParse(await response.json())

            if (!responseParsed.success) {
                const e: Error = new Error(
                    "Unexpected Response Type@getIds::api",
                )
                e.name = "Unexpected Response Type@getIds::api"
                throw e
            }

            const apiResult: idsFetchOutput = responseParsed.data
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
