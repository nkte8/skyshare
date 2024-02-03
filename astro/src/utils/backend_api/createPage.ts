import etype from "./models/error.json";
const endpoint_url = import.meta.env.PUBLIC_CREATEPAGES_ENDPOINT

type output = {
    uri: string
}

export const api = async ({
    uri,
    accessJwt,
}: {
    uri: string,
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
                    uri: uri,
                    accessJwt: accessJwt
                })
        }).then((response) => response.json()
        ).catch(() => { })
}

export default api