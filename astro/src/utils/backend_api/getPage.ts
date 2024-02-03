import mtype from "./models/db.json";
import etype from "./models/error.json";
const endpoint_url = import.meta.env.PUBLIC_GETPAGES_ENDPOINT
const object = "page"

export const api = async ({
    id
}: {
    id: string
}): Promise<typeof mtype & typeof etype> => {
    const url = new URL(
        object + "/" + encodeURIComponent(id),
        endpoint_url)
    return fetch(url,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()
        ).catch(() => {})
}

export default api