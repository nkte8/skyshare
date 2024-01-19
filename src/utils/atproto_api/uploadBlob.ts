import endpoint_url, { com_atproto } from "./base"
import mtype from "./models/uploadBlob.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.repo.uploadBlob)

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
    }).then((response) => response.json()
    ).catch(() => {
        console.log("error");
    })

export default api