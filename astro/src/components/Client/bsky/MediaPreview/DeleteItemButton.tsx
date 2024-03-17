import { Dispatch, SetStateAction } from "react"
import { MediaData } from "../type"

const Component = ({
    itemId,
    mediaDataList,
    setMediaDataList
}: {
    itemId: number,
    mediaDataList: MediaData | null,
    setMediaDataList: Dispatch<SetStateAction<MediaData | null>>
}) => {
    const handleClick = () => {
        if (itemId < 0 || itemId > 3) {
            return
        }
        if (mediaDataList === null) {
            return
        }
        if (mediaDataList.type === "external"){
            // linkcardは1枚なので消した時点でlistは空
            setMediaDataList(null)
            return
        }
        if (mediaDataList.type === "images") {
            if (mediaDataList.blobs.length < 0) {
                return
            }
            // Listから自身のitemIdを取り除き、これをリストに追加する
            let result = mediaDataList.blobs.filter(
                (_, index) => index !== itemId
            )
            // 全てのメディアが削除された場合は null とする
            if (result.length <= 0) {
                setMediaDataList(null)
                return
            }
            setMediaDataList({
                type: mediaDataList.type,
                blobs: result
            })
        }
    }
    return (
        <>
            <button
                onClick={handleClick}
                className={[
                    "rounded-full",
                    "h-8", "w-8",
                    "border-2",
                    "bg-white",
                    "border-gray-700",
                    "absolute",
                    "left-1",
                    "top-1",
                ].join(" ")}>
                ✖️
            </button>
        </>
    )
}
export default Component
