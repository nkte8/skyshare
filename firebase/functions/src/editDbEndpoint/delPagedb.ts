import redisDel from "../upstash/redisDel"
import { envName } from '../vars'

/**
 * upstash Redisからページデータを削除
 *
 * @param {Object} props
 * @param {"dev" | "prod"} props.env dev or prod
 * @param {string} props.keName upstash keyname
 */
const delOgbPageDB = ({
    env, keyName
}: {
    env: envName,
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
export default delOgbPageDB
