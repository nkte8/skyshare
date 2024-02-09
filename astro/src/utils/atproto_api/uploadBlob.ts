import getEndpoint, { com_atproto } from "./base"
import mtype from "./models/uploadBlob.json"
import etype from "./models/error.json"
const apiName = com_atproto.repo.uploadBlob
const endpoint = getEndpoint(apiName)

export const api = async ({
    accessJwt,
    mimeType,
    blob,
}: {
    accessJwt: string,
    mimeType: string,
    blob: Uint8Array
}
): Promise<typeof mtype & typeof etype> => fetch(endpoint,
    {
        method: 'POST',
        headers: {
            'Content-Type': mimeType,
            'Authorization': `Bearer ${accessJwt}`
        },
        body: blob,
    }).then(async (response) => {
        if (!response?.ok) {
            let res: typeof etype = await response.json()
            let e: Error = new Error(res.message)
            e.name = apiName
            throw e
        }
        return await response.json()
    }
    ).catch((e: Error) => {
        return {
            error: e.name,
            message: e.message
        }
    })

export default api