![](./public/materials/longlogo.svg)

[Skyshare](https://skyshare.uk/) is web application that BlueSky user saves their time of boring SNS X.com(Twitter).

## How works

Skyshare post your post to Bluesky with AT Protocol.  
for twitter, because of X taxes, Skyshare present Post Link: [Like that](https://twitter.com/intent/tweet?text=This&nbsp;is&nbsp;tweet&nbsp;sample.&url=https://skyshare.uk/posts/nlla.bsky.social_3kk7qzpffl22n/), can only with media by OGP image.

## AT Protocol

Because of bluesky official typescript client seems not available works on React, Skyshare uses REST API directry by fetch API.  

## Build

Setup node_modules:
```sh
docker run --rm -v $PWD:/src -w /src -u `id -u`:`id -g` -p 80:4321 -it node:18.17.1 npm install
```
Into node container:
```sh
docker run --rm -v $PWD:/src -w /src -u `id -u`:`id -g` -p 80:4321 -it node:18.17.1 /bin/bash
```

setup .env:
```sh
GETPAGES_ENDPOINT="getpages_endpoint"
PUBLIC_CREATEPAGES_ENDPOINT="createpages_endpoint"
```

```sh
# astro develop server
npm run dev
```

## Deploy 

This application works as SSR mode in cloudflare, no support by SSG.
