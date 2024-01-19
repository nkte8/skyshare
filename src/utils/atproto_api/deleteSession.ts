import endpoint_url, { com_atproto } from "./base"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.server.deleteSession)

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
    }).then((response) => response.json()
    ).catch(() => {
        console.log("error");
    })

export default api