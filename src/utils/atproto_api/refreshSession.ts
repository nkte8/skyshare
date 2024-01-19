import endpoint_url,{ com_atproto } from "./base"
import mtype from "./models/refreshSession.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.server.refreshSession)

export const api = async ({
    refreshJwt,
}: {
    refreshJwt: string,
}): Promise<typeof mtype & typeof etype> => fetch(endpoint,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshJwt}`
        },
    }).then((response) => response.json()
    ).catch(() => {
        console.log("error");
    })

export default api