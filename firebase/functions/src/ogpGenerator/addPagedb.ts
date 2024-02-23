import redisSet from "../upstash/redisSet"
import { envName } from '../vars'

/**
 * upstash Redisへページ情報を追加
 * @param {Object} props
 * @param {"dev" | "prod"} props.env dev or prod
 * @param {string} props.keName upstash keyname
 * @param {T} props.dbData 登録するデータ構造を定義
 */
export const addOgbPageDB = <T>({
    env, keyName, dbData
}: {
    env: envName,
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
