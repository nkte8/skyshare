import etype from "./models/error.json";
const endpoint_url = import.meta.env.PUBLIC_GETPAGES_ENDPOINT
const object = "user"

type output = {
    ids: Array<string>
}

export const api = async ({
    handle
}: {
    handle: string
}): Promise<output & typeof etype> => {
    const url = new URL(
        object + "/" + encodeURIComponent(handle),
        endpoint_url)
    return fetch(url,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()
        ).catch((e: Error) => {
            return {
                error: e.name,
                message: e.message
            }
        })
}

export default api