import etype from "./models/error.json";
const endpoint_url = import.meta.env.PUBLIC_CREATEPAGES_ENDPOINT

type output = {
    uri: string
}

/**
 * pageDBへページを追加
 *
 * @param {Object} props
 * @param {string} props.uri 元投稿のuri
 * @param {string} props.accessJwt アクセストークン
 */
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
        ).catch((e: Error) => {
            return {
                error: e.name,
                message: e.message
            }
        })
}

export default api