/**
 * upstash redisから情報を削除するAPI
 * @param {Object} props
 * @param {Object} props.auth redisへの認証データ
 * @param {endpoint} props.auth.endpoint エンドポイントのURL
 * @param {token} props.auth.token トークン
 * @param {key} props.key 削除するキー情報
 */
export const api = async ({
    auth,
    key
}: {
    auth: {
        endpoint: string,
        token: string,
    }
    key: string
}): Promise<{ result: "string" }> => {
    const url = new URL(`DEL/${encodeURIComponent(key)}`, auth.endpoint)
    return fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        }).then((response) => response.json()
        ).catch(() => {})
}

export default api