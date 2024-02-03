import redisDel from "../upstash/redisDel"

export const delOgbPageDB = ({
    env, keyName
}: {
    env: "dev" | "prod",
    keyName: string
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
    return redisDel({
        auth: {
            endpoint: endpoint,
            token: token
        },
        key: keyName,
    })
}
