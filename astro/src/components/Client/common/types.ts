import { ogpMetaData } from "@/lib/types"
export type modes = "bsky" | "pagedb" | "xcom"

export type msgInfo = {
    msg: string,
    isError: boolean,
}

export type MediaData = LinkCard | Images | null
type LinkCard = {
    type: "external",
    // 処理の便宜上 Imagesと同様にArrayとしているが
    // 実際は項目数1の配列。改善したい。
    images: Array<{
        blob: Blob | null,
    }>
    meta: ogpMetaData & {
        url: string
    }
}
type Images = {
    type: "images",
    images: Array<{
        alt: string,
        blob: Blob,
    }>
}