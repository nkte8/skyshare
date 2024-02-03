import endpoint_url, { com_atproto } from "./base"
import mtype from "./models/getSession.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.server.getSession)

export const api = async ({
    accessJwt,
}: {
    accessJwt: string,
}): Promise<typeof mtype & typeof etype> => fetch(endpoint,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessJwt}`
        },
    }).then((response) => response.json()
    ).catch(() => {})

export default api