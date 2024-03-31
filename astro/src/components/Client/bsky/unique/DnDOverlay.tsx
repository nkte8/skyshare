// utils
import { Dispatch, SetStateAction } from "react"

// service
import { addImageMediaData, collectNewImages } from "../lib/addImageMediaData"
import { MediaData } from "../../common/types"

const Component = ({
    onHide,
    mediaData,
    setMediaData,
}: {
    onHide: () => void
    mediaData: MediaData
    setMediaData: Dispatch<SetStateAction<MediaData>>
}) => {
    const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleOnDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        onHide()
    }

    const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
        onHide()

        e.preventDefault()

        const items: DataTransferItemList = e.dataTransfer.items

        if (items.length <= 0) {
            return
        }

        const newImageFiles = collectNewImages(items)

        if (newImageFiles.length <= 0) {
            return
        }

        addImageMediaData(newImageFiles, mediaData, setMediaData)
    }

    return (
        <div
            onDragOver={handleOnDragOver}
            onDrop={handleOnDrop}
            onDragLeave={handleOnDragLeave}
            className="fixed absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-9999"
        >
            <p className="text-white text-lg">ファイルをここにドロップ</p>
        </div>
    )
}

export default Component
