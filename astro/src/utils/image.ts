import { compressImage } from "@/utils/compressimage"
import { Dispatch, SetStateAction } from "react"

const maxAttachableImages = 4
const allowedMimeTypes: string[] = ["image/png", "image/jpeg"]
const imageExtensions: string[] = ["png", "jpeg", "jpg"]

/**
 *
 * @param newImageFiles 新規に追加されたファイル配列
 * @param imageFiles 既存の画像ファイル配列
 * @param setImageFile 画像ファイル配列のセッター
 */
const addImages = async (
    newImageFiles: File[],
    imageFiles: File[],
    setImageFile: Dispatch<SetStateAction<File[]>>,
): Promise<void> => {
    if (newImageFiles.length <= 0) {
        return
    }

    const existingImageFiles: File[] = imageFiles.length > 0 ? imageFiles : []
    const additionalImageFiles: Promise<File>[] = []

    newImageFiles.forEach((file: File) => {
        if (allowedMimeTypes.includes(file.type)) {
            additionalImageFiles.push(compressImage(file))
        }
    })

    const concatenatedFiles: File[] = existingImageFiles.concat(
        await Promise.all<File>(additionalImageFiles),
    )

    const resultFiles: File[] = concatenatedFiles.slice(0, maxAttachableImages)

    setImageFile(resultFiles)
}

export { imageExtensions, addImages }
