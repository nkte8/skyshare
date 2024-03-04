namespace embed {
    export type images = {
        $type: "app.bsky.embed.images",
        images: Array<{
            image: {
                $type: "blob" | string,
                ref: {
                    $link: string
                },
                mimeType: string,
                size: number
            },
            alt: string,
            aspectRaito?: {
                width: number,
                height: number
            }
        }>
    }
    export type external = {
        $type: "app.bsky.embed.external",
        external: {
            uri: string,
            title: string,
            description: string,
            thumb?: {
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