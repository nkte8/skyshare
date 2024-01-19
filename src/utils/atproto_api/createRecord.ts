import endpoint_url, { com_atproto, app_bsky } from "./base"
import mtype from "./models/createRecord.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.repo.createRecord)

export const api = async ({
    repo,
    accessJwt,
    record
}: {
    repo: string,
    accessJwt: string,
    record: object
}): Promise<typeof mtype & typeof etype> => fetch(endpoint,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessJwt}`
        },
        body: JSON.stringify(
            {
                collection: app_bsky.feed.post,
                repo: repo,
                record: record
            })
    }).then((response) => response.json()
    ).catch(() => {
        console.log("error");
    })

export default api