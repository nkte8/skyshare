import { ogpMetaData } from "@/lib/types"
export type MediaData = LinkCard | Image

type LinkCard = {
    type: "linkcard",
    blob: Blob | null,
    meta: ogpMetaData & {
        url: string
    }
}
type Image = {
    type: "image",
    alt: string,
    blob: Blob | null,
}