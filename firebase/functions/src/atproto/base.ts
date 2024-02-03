const xrpc_url = "https://bsky.social/xrpc";
export const endpoint_url = (path: string): string => {
    return `${xrpc_url}/${path}`
}
export namespace com_atproto {
    export const url = "com.atproto"
    export namespace server {
        export const url = `${com_atproto.url}.server`
        export const getSession = `${com_atproto.server.url}.getSession`
    }
}

export namespace app_bsky {
    export const url = "app.bsky"
    export namespace feed {
        export const url = `${app_bsky.url}.feed`
        export const post = `${app_bsky.feed.url}.post`
        export const getPostThread = `${app_bsky.feed.url}.getPostThread`
    }
}
export default endpoint_url
