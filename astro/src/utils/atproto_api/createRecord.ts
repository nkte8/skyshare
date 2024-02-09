import getEndpoint, { com_atproto, app_bsky } from "./base"
import mtype from "./models/createRecord.json"
import etype from "./models/error.json"
const apiName = com_atproto.repo.createRecord
const endpoint = getEndpoint(apiName)

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
    }).then(async (response) => {
        if(!response?.ok) {
            let res:typeof etype = await response.json()
            let e: Error = new Error(res.message)
            e.name = apiName
            throw e
        }
        return await response.json()
    }
    ).catch((e:Error) => {
        return {
            error: e.name,
            message: e.message
        }
    })
    

export default api