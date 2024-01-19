import endpoint_url, { com_atproto, app_bsky } from "./base"
import mtype from "./models/getRecord.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.repo.getRecord)

export const api = async ({
    rkey,
    did,
}: {
    rkey: string,
    did: string
}): Promise<typeof mtype & typeof etype> => {
    const url = new URL(endpoint)
    url.searchParams.set("repo", did)
    url.searchParams.set("rkey", rkey)
    url.searchParams.set("collection", app_bsky.feed.post)
    return fetch(
        url.toString(),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()
        ).catch(() => {
            console.log("error");
        })

}

export default api