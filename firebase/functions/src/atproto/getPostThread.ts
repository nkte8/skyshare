import endpoint_url, { app_bsky } from "./base"
import mtype from "./models/getPostThread.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(app_bsky.feed.getPostThread)

export const api = async ({
    accessJwt,
    uri,
}: {
    accessJwt: string,
    uri: string
}): Promise<typeof mtype & typeof etype> => {
    const url = new URL(endpoint)
    url.searchParams.set("uri", uri)
    return fetch(
        url.toString(),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessJwt}`
            },
        }).then((response) => response.json()
        ).catch(() => {})

}

export default api