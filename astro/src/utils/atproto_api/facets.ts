namespace facet {
    export type link = {
        index: {
            byteStart: number,
            byteEnd: number,
        }
        features: [
            {
                $type: "app.bsky.richtext.facet#link",
                uri: string
            }
        ]
    }
    export type mention = {
        index: {
            byteStart: number,
            byteEnd: number,
        }
        features: [
            {
                $type: "app.bsky.richtext.facet#mention",
                did: string
            }
        ]
    }
}
export default facet