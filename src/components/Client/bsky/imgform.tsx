import React, { useRef, Dispatch, SetStateAction } from "react"
import { button_base } from "../tailwind_variants"
import { compressImage } from "@/utils/compressimage"

const mimetypes: Array<string> = [
    "image/png", "image/jpeg"
]
const extensions: Array<string> =[
    "png","jpeg","jpg"
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
        let files: Array<Promise<File>> = [] ;
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
            <div>
                <input type="file" accept={acceptlist}
                    ref={inputRef}
                    style={{ display: "none" }}
                    onChange={handleFilechanged}
                    multiple />
                <button className={button_base({ class: "m-1", mode: !disabled })}
                    type="button" disabled={disabled}
                    onClick={handleClick}>画像を選択</button>
            </div>
        </>
    )
}

export default Component
