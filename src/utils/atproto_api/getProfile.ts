import endpoint_url, { app_bsky } from "./base"
import mtype from "./models/getProfile.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(app_bsky.actor.getProfile) 

export const api = async ({
    handle,
    accessJwt,
}: {
    handle: string,
    accessJwt: string,
}): Promise<typeof mtype & typeof etype> => {
    const url = new URL(endpoint)
    url.searchParams.set("actor", handle)
    return fetch(
        url.toString(),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessJwt}`
            },
        }).then((response) => response.json()
        ).catch(() => {
            console.log("error");
        })
}
export default api