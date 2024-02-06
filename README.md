![](./astro/public/materials/longlogo.svg)

[Skyshare](https://skyshare.uk/) is web application that BlueSky user saves their time of boring SNS X.com(Twitter).

# How works

Skyshare post your post to Bluesky with AT Protocol.  
for twitter, because of X taxes, Skyshare present Post Link: [Like that](https://twitter.com/intent/tweet?text=This&nbsp;is&nbsp;tweet&nbsp;sample.&url=https://skyshare.uk/posts/nlla.bsky.social_3kk7qzpffl22n/), can only with media by OGP image.

## AT Protocol

Because of bluesky official typescript client seems not available works on React, Skyshare uses REST API directry by fetch API like that...  

```ts:client/src/utils/atproto_api/createSession.ts
import endpoint_url, { com_atproto } from "./base"
import mtype from "./models/createSession.json"
import etype from "./models/error.json"
const endpoint = endpoint_url(com_atproto.server.createSession)

export const api = async ({
    identifier,
    password,
}:{
    identifier: string,
    password: string,
}): Promise<typeof mtype & typeof etype> => fetch(endpoint,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                identifier: identifier,
                password: password,
            })
    }).then((response) => response.json()
    ).catch(() => {})

export default api
```

# How to debug or deploy

This Repository become monorepo for manage all versions with changeset.

## workspace: client

at first setup .env from .env.template
```sh
PUBLIC_CREATEPAGES_ENDPOINT="createpages_endpoint"
PUBLIC_DELETEPAGE_ENDPOINT="deletepage_endpoint"
PUBLIC_GETPAGES_ENDPOINT="getpages_endpoint"
```

Local server debug
```sh
npx -w astro/ astro dev
```
Build
```sh
npx -w astro/ astro build
```

## workspace: firebase

at first setup .env from .env.template
```sh
UPSTASH_REDIS_REST_URL="upstash_redis_rest_url"
UPSTASH_REDIS_REST_TOKEN="upstash_redis_rest_token"
DEV_UPSTASH_REDIS_REST_URL="dev_upstash_redis_rest_url"
DEV_UPSTASH_REDIS_REST_TOKEN="dev_upstash_redis_rest_token"
```

Local server debug
```sh
npm run build
npx -w firebase/ firebase serve -o 192.168.3.200 -p 5000
```
Build
```sh
npx -w firebase/ firebase deploy
```

## workspace: workers

at first setup ..dev.vars from .dev.vars.template
```sh
UPSTASH_REDIS_REST_URL="upstash_redis_rest_url"
UPSTASH_REDIS_REST_TOKEN="upstash_redis_rest_token"
DEV_UPSTASH_REDIS_REST_URL="dev_upstash_redis_rest_url"
DEV_UPSTASH_REDIS_REST_TOKEN="dev_upstash_redis_rest_token"
```

Local server debug
```sh
kill -9 $(lsof -t -i:8087)
npx -w workers/ wrangler --port 8087 dev 
```

Deploy dev or prod
```sh
npx -w workers/ wrangler deploy 
# as prod
npx -w workers/ wrangler --env prod deploy 
```

# check changelog

Changeset application
```sh
npx changeset
```

After set summary, Create CHANGELOG.md:
```sh
npx changeset version
```

## more info

[Zenn article: for japanese developer](https://zenn.dev/nkte8/articles/2024-02-03-r01)
