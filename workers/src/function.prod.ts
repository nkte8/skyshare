import { Redis } from "@upstash/redis/cloudflare";
import { Buffer } from 'node:buffer';

type response = ids | bskylinxDB | {
    error: string, message: string
}

type ids = {
    ids: Array<string>
}

type bskylinxDB = {
    ogp: string,
    imgs: Array<{
        thumb: string,
        alt: string
    }>
}

const readPagedb = async ({
    request, redis
}: {
    request: Request,
    redis: Redis
}) => {
    const url = new URL(request.url);
    const pathArray = url.pathname.split('/');
    let data: response = {
        error: "Invalid request",
        message: "Invalid request"
    }

    if (request.method !== "GET") {
        return {
            error: "Invalid request",
            message: "Invalid request"
        }
    }
    try {
        const object = pathArray[1]
        const param = decodeURIComponent(pathArray[2])
        switch (object) {
            case "page":
                const dataBodyEncorded = await redis.get<string>(param)
                if (dataBodyEncorded !== null) {
                    const dataTyped: bskylinxDB =
                        JSON.parse(Buffer.from(dataBodyEncorded, "base64").toString())
                    data = dataTyped
                } else {
                    data = {
                        error: "No item",
                        message: `${pathArray[2]} was not available key.`
                    }
                }
                break
            case "user":
                const [_, keys] = await redis.scan(0, { match: `${param}*` });
                const dataTyped: ids = {
                    ids: keys
                }
                data = dataTyped
                break
        }
    } catch (error) {
        data = {
            error: "Unexpected Error",
            message: "Unexpected Error occurd" + error
        }
    }
    return data
}
export default readPagedb