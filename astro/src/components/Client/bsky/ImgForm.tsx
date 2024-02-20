import React, { useRef, Dispatch, SetStateAction } from "react"
import { compressImage } from "@/utils/compressimage"
import ProcButton from "../common/ProcButton"
import pic from "@/images/image.svg"
const mimetypes: Array<string> = [
    "image/png", "image/jpeg"
]
const extensions: Array<string> = [
    "png", "jpeg", "jpg"
]

const get_mimetype = (name: string): boolean => {
    let result = false
    mimetypes.forEach((value) => {
        if (name === value) {
            result = true
        }
    })
    return result
}

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
    const maxImages = 4

    const handleFilechanged = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputFiles = event.currentTarget.files;
        let resultFiles: Array<File> = []
        // 入力されたファイルがない場合は処理を中断
        if (!inputFiles || inputFiles?.length === 0) {
            event.target.value = ""
            return
        }
        if (imageFiles.length > 0 ) {
            resultFiles = imageFiles
        }
        let files: Array<Promise<File>> = [];
        Array.from(inputFiles).forEach((value) => {
            if (get_mimetype(value.type) !== false) {
                files.push(compressImage(value))
            }
        })
        resultFiles = resultFiles.concat(await Promise.all<File>(files))
        resultFiles = resultFiles.slice(0,maxImages)
        setImageFile(resultFiles)
        event.target.value = ""
    }

    const acceptlist = extensions.join(",")
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
