import redisSet from "../upstash/redisSet"

export const addOgbPageDB = <T>({
    env, keyName, dbData
}: {
    env: "dev" | "prod",
    keyName: string,
    dbData: T
}) => {
    let envParam = {
        dev: {
            endpoint: process.env.DEV_UPSTASH_REDIS_REST_URL,
            token: process.env.DEV_UPSTASH_REDIS_REST_TOKEN
        },
        prod:{
            endpoint: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN
        }
    };
    const endpoint = envParam[env].endpoint
    const token = envParam[env].token
    if (typeof endpoint === "undefined" || typeof token === "undefined") {
        return null
    }
    return redisSet<T>({
        auth: {
            endpoint: endpoint,
            token: token
        },
        key: keyName,
        value: dbData,
    })
}
