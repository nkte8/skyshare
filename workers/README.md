# cloudflare worker 

## setup repository
install wrangler environment have X window system
```sh
sudo npm install -g wrangler
```
setup repository
```sh
npm install
```

## Build & Debug

local server build & debug
```sh
kill -9 $(lsof -t -i:8087)
wrangler --port 8087 dev 
```

## Deploy

deploy as staging
```sh
wrangler deploy 
```

deploy as prod
```sh
wrangler --env prod deploy 
```
