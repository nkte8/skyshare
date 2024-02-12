namespace embed {
    export type images = {
        $type: "app.bsky.embed.images",
        images: Array<{
            image: {
                cid: string,
                mimeType: string
            },
            alt: string
        }>
    }
    export type external = {
        $type: "app.bsky.embed.external",
        external: {
            uri: string,
            title: string,
            description: string,
            thumb: {
                ref: {
                    $link: string
                },
                mimeType: string,
                size: number
            },
        }
    }
}
export default embed