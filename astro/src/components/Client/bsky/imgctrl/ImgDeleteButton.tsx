import { Dispatch, SetStateAction } from "react"


const Component = ({
    itemId,
    imageFiles,
    setImageFile,
    altTexts,
    setAltText,
}: {
    itemId: number,
    imageFiles: Array<File>,
    setImageFile: Dispatch<SetStateAction<File[]>>,
    altTexts: Array<string>,
    setAltText: Dispatch<SetStateAction<Array<string>>>
}) => {
    const handleClick = () => {
        if (itemId < 0 || itemId > 3) {
            return
        }
        if (imageFiles === null || imageFiles?.length < 0) {
            return
        }
        let resultFiles: Array<File> = imageFiles.filter(
            (_, index) => index !== itemId
        )
        let resultAlts: Array<string> = altTexts.filter(
            (_, index) => index !== itemId
        )
        resultAlts.push("")
        setImageFile(resultFiles)
        setAltText(resultAlts)
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
