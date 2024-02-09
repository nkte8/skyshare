import getEndpoint, { com_atproto } from "./base"
import etype from "./models/error.json"
const apiName = com_atproto.server.deleteSession
const endpoint = getEndpoint(apiName)

// deleteSessionはエラー時以外は返り値がない
export const api = async ({
    refreshJwt,
}: {
    refreshJwt: string,
}): Promise<void & typeof etype> => fetch(endpoint,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshJwt}`
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

export default api