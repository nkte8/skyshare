import endpoint_url, { com_atproto } from "./base"
import mtype from "./models/resolveHandle.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.identity.resolveHandle)

export const api = async ({
    handle
}: {
    handle: string,
}): Promise<typeof mtype & typeof etype> => {
    const url = new URL(endpoint)
    url.searchParams.set("handle", handle)
    return fetch(
        url.toString(),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()
        ).catch(() => {})
}

export default api