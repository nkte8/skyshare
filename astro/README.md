# Build Frontend
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
PUBLIC_CREATEPAGES_ENDPOINT="createpages_endpoint" # set firebase fucntion endpoint
PUBLIC_DELETEPAGE_ENDPOINT="deletepage_endpoint" # set firebase funciton endpoint
PUBLIC_GETPAGES_ENDPOINT="getpages_endpoint" # set cloudflare worker endpoint
PUBLIC_IS_NOT_PRODUCTION="True_or_False" # if not deploy to prod, set flag true. if prod, need not to set or set false
```

```sh
# astro develop server
npm run dev
```

## Deploy 

This application works as SSR mode in cloudflare, no support by SSG.
