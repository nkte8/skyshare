import { Dispatch, SetStateAction } from "react"
import { MediaData } from "../type"

const Component = ({
    itemId,
    mediaDataList,
    setMediaDataList
}: {
    itemId: number,
    mediaDataList: Array<MediaData>,
    setMediaDataList: Dispatch<SetStateAction<Array<MediaData>>>
}) => {
    const handleClick = () => {
        if (itemId < 0 || itemId > 3) {
            return
        }
        if (mediaDataList.length < 0) {
            return
        }
        // Listから自身のitemIdを取り除き、これをリストに追加する
        let result: Array<MediaData> = mediaDataList.filter(
            (_, index) => index !== itemId
        )
        setMediaDataList(result)
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
