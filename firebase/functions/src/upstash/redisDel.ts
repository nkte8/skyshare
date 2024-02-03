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