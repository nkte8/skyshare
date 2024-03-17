import { ogpMetaData } from "@/lib/types"
export type MediaData = LinkCard | Images
type LinkCard = {
    type: "external",
    // 処理の便宜上 Imagesと同様にArrayとしているが
    // 実際は項目数1の配列。改善したい。
    blobs: Array<{
        blob: Blob | null,
    }>
    meta: ogpMetaData & {
        url: string
    }
}
type Images = {
    type: "images",
    blobs: Array<{
        alt: string,
        blob: Blob,
    }>
}
export type buttonID = "" | "post" | "linkcardattach"
