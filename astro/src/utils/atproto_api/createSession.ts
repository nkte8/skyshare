import endpoint_url, { com_atproto } from "./base"
import mtype from "./models/createSession.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.server.createSession)

export const api = async ({
    identifier,
    password,
}:{
    identifier: string,
    password: string,
}): Promise<typeof mtype & typeof etype> => fetch(endpoint,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                identifier: identifier,
                password: password,
            })
    }).then((response) => response.json()
    ).catch(() => {})

export default api