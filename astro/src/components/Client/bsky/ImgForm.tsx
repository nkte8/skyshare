import React, { useRef, Dispatch, SetStateAction } from "react"
import ProcButton from "../common/ProcButton"
import pic from "@/images/image.svg"
import { imageExtensions, addImages } from "@/utils/image"

const Component = ({
    disabled,
    imageFiles,
    setImageFile,
    className,
}: {
    disabled: boolean
    imageFiles: Array<File>
    setImageFile: Dispatch<SetStateAction<File[]>>
    className?: string
}) => {
    const inputRef = useRef<HTMLInputElement>(null!);
    const handleClick = () => { inputRef.current.click() }

    /**
     * ファイル選択時の処理を行います
     * @param event チェンジイベント
     * @returns なし
     */
    const handleFilechanged = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const inputFiles: FileList | null = event.currentTarget.files
        // 入力されたファイルがない場合は処理を中断
        if (!inputFiles || inputFiles?.length === 0) {
            event.target.value = ""
            return
        }

        await addImages([...inputFiles], imageFiles, setImageFile)
        event.target.value = ""
    }

    const acceptlist = imageExtensions.join(",")
    return (
        <>
            <input type="file" accept={acceptlist}
                ref={inputRef}
                style={{ display: "none" }}
                onChange={handleFilechanged}
                multiple />
            <ProcButton handler={handleClick}
                isProcessing={disabled}
                className={className}
                context={
                    <>
                        <img src={pic.src}
                            className="w-7 h-7 p-0.5 inline-block align-middle" />
                    </>}
                showAnimation={false} />

        </>
    )
}

export default Component
