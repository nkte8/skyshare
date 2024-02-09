import getEndpoint, { com_atproto } from "./base"
import mtype from "./models/resolveHandle.json"
import etype from "./models/error.json"
const apiName = com_atproto.identity.resolveHandle
const endpoint = getEndpoint(apiName)

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
}

export default api