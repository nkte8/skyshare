import { z } from "zod"
import etype from "./models/error.json"
const endpoint_url = import.meta.env.PUBLIC_GETPAGES_ENDPOINT as string
const object = "user"

const IdsFetchOutputZod = z.object({
    ids: z.array(z.string()),
})
type output = {
    ids: Array<string>
}

export const api = async ({
    handle,
}: {
    handle: string
}): Promise<output | typeof etype> => {
    const url = new URL(object + "/" + encodeURIComponent(handle), endpoint_url)
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            const responseParsed = IdsFetchOutputZod.safeParse(response.json())

            if (!responseParsed.success) {
                const e: Error = new Error("Unexpected Response Type@getIds::api")
                e.name = "Unexpected Response Type@getIds::api"
                throw e
            }

            const apiResult: output = responseParsed.data
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
