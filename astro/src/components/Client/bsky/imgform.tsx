import React, { useRef, Dispatch, SetStateAction } from "react"
import { compressImage } from "@/utils/compressimage"
import ProcButton from "../common/procButton"
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

const Component = ({ disabled, setImageFile }: {
    disabled: boolean
    setImageFile: Dispatch<SetStateAction<File[] | null>>
}) => {
    const inputRef = useRef<HTMLInputElement>(null!);

    const handleClick = () => { inputRef.current.click() }

    const handleFilechanged = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const filelist = event.currentTarget.files;
        const reset = () => {
            setImageFile(null)
        }
        if (!filelist || filelist?.length === 0) {
            reset(); return
        }
        let files: Array<Promise<File>> = [];
        Array.from(filelist).forEach((value, index) => {
            if (index >= 4) {
                return
            }
            if (get_mimetype(value.type) !== false) {
                files.push(compressImage(value))
            }
        })
        if (files.length <= 0) {
            reset()
            return
        }
        setImageFile(await Promise.all(files))
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
                context={
                    <>
                        <div className="align-middle">
                            <img src={pic.src} className="w-4 h-4 inline-block mr-1 my-auto align-middle" />
                            <span className="align-middle">画像を選択</span>
                        </div>
                    </>}
                showAnimation={false} />

        </>
    )
}

export default Component
