import etype from "./models/error.json";
const endpoint_url = import.meta.env.PUBLIC_DELETEPAGE_ENDPOINT

type output = {
    result: string
}

export const api = async ({
    id,
    did,
    accessJwt
}: {
    id: string
    did: string,
    accessJwt: string
}): Promise<output & typeof etype> => {
    return fetch(endpoint_url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    id: id,
                    did: did,
                    accessJwt: accessJwt
                })
        }).then((response) => response.json()
        ).catch((e: Error) => {
            return {
                error: e.name,
                message: e.message
            }
        })
}

export default api