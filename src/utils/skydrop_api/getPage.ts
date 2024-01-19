import mtype from "./models/db.json";
import etype from "./models/error.json";
const endpoint_url = import.meta.env.GETPAGES_ENDPOINT

export const api = async ({
    slug
}: {
    slug: string
}): Promise<typeof mtype & typeof etype> => {
    const url = new URL(slug, endpoint_url)
    console.log(url)
    return fetch(url,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()
        ).catch(() => {
            console.log("error");
        })
}

export default api