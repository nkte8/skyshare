// utils
import { Dispatch, SetStateAction } from "react"

// service
import { MediaData } from "../../common/types"

const maxAttachableImages = 4
const allowedMimeTypes: string[] = ["image/png", "image/jpeg"]
const imageExtensions: string[] = ["png", "jpeg", "jpg"]

/**
 *
 * @param Blobs 追加するFile
 */
const addImageMediaData = async (
    Blobs: Array<File>,
    MediaData: MediaData,
    setMediaData: Dispatch<SetStateAction<MediaData>>,
): Promise<void> => {
    if (Blobs.length <= 0) {
        return
    }
    // MediaData型は毎回typeにimagesを指定して定義しなおす
    const newMediaData: MediaData = {
        type: "images",
        images: MediaData !== null && MediaData.type === "images" ? MediaData.images : []
    }
    // MediaDataImagesを定義
    const newMediaDataImages: Array<{ alt: string, blob: Blob }> = [
        ...newMediaData.images,
        ...(
            Blobs.filter(
                value => allowedMimeTypes.includes(value.type)
            ).map((value) => {
                return {
                    alt: "",
                    blob: new Blob([value], {
                        type: value.type
                    })
                }
            }))
    ]
    // 結合
    const result: MediaData = {
        type: "images",
        images: newMediaDataImages.slice(0, maxAttachableImages)
    }
    setMediaData(result)
}

/**
 * データ転送アイテムリストから画像ファイルのリストを作成します
 * @param items データ転送アイテムリスト
 * @returns 画像ファイルのリスト
 */
const collectNewImages = (items: DataTransferItemList): File[] => {
    const newImageFiles: File[] = []
    for (const item of items) {
        const file: File | null = item.getAsFile()

        if (file != null && file.type.startsWith("image")) {
            newImageFiles.push(file)
        }
    }
    return newImageFiles
}

export { imageExtensions, addImageMediaData, collectNewImages }
