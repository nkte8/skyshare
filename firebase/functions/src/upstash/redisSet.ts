export const api = async <T>({
    auth,
    key,
    value,
}: {
    auth: {
        endpoint: string,
        token: string,
    }
    key: string,
    value: T
}): Promise<{ result: "string" }> => {
    const url = new URL(`SET/${encodeURIComponent(key)}`, auth.endpoint)
    const TTL = (60 * 60) * 24 * 90
    url.searchParams.append("EX",TTL.toString())
    return fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: Buffer.from(JSON.stringify(
                value
            )).toString('base64')
        }).then((response) => response.json()
        ).catch(() => {
            console.log("error");
        })
}

export default api