# Skydrop

Skydrop is web application that BlueSky user saves their time of boring SNS X.com(Twitter).

## How works

Skydrop post your post to Bluesky with AT Protocol.  
for twitter, because of X taxes, Skydrop present Post Link: [Like that](https://twitter.com/intent/tweet?text=This&nbsp;is&nbsp;tweet&nbsp;sample.&url=https://nkte8.github.io/skydrop/posts/EXAMPLE/), can only with media by OGP image.

## Setup

Setup node_modules:
```sh
docker run --rm -v $PWD:/src -w /src -u `id -u`:`id -g` -p 80:4321 -it node:18.17.1 npm install
```
Into node container:
```sh
docker run --rm -v $PWD:/src -w /src -u `id -u`:`id -g` -p 80:4321 -it node:18.17.1 /bin/bash
```

```sh
# astro develop server
npm run dev
```

## Deploy 

This application works as SSR mode in cloudflare, no support by SSG.