import { tv } from "tailwind-variants";
import { Dispatch, ReactNode, SetStateAction } from "react"
import ImgDeleteButton from "./ImgDeleteButton"
import ImgAltDialog from "./ImgAltDialog"

const view = tv({
    base: "object-cover border-2 border-white w-full h-full m-0 p-0",
    variants: {
        size: {
            w_half: "w-1/2 h-full",
            h_half: "h-1/2 w-full",
            half: "w-1/2 h-1/2"
        }
    }
})

const Component = ({
    imageFiles,
    setImageFile,
    altTexts,
    setAltText,
}: {
    imageFiles: Array<File>,
    setImageFile: Dispatch<SetStateAction<File[]>>
    altTexts: Array<string>,
    setAltText: Dispatch<SetStateAction<Array<string>>>
}) => {

    const imgBox = ({
        index,
        classNameImage,
        className
    }: {
        index: number,
        classNameImage?: string,
        className?: string
    }) => {
        return (
            <div className={"relative " + className}>
                <ImgDeleteButton
                    itemId={index}
                    imageFiles={imageFiles}
                    setImageFile={setImageFile}
                    altTexts={altTexts}
                    setAltText={setAltText} />
                <ImgAltDialog
                    file={imageFiles[index]}
                    itemId={index}
                    altTexts={altTexts}
                    setAltText={setAltText} />
                <img
                    src={URL.createObjectURL(imageFiles[index])}
                    alt={imageFiles[index].name}
                    className={classNameImage}
                />
            </div>
        )
    }

    const imgFrame = (index: number): ReactNode => {
        switch (index) {
            case 0:
                return (<div className="w-full h-full m-0">
                    {imgBox({
                        index: 0,
                        className: view({ class: "inline-block" }),
                        classNameImage: view({ class: "rounded-3xl" })
                    })}
                </div>)
            case 1:
                return (<div className="w-full h-full m-0">
                    {imgBox({
                        index: 0,
                        className: view({ class: "inline-block", size: "w_half" }),
                        classNameImage: view({ class: "rounded-l-3xl" })
                    })}
                    {imgBox({
                        index: 1,
                        className: view({ class: "inline-block", size: "w_half" }),
                        classNameImage: view({ class: "rounded-r-3xl" })
                    })}
                </div>)
            case 2:
                return (<div className={[
                    "h-full", "m-0"
                ].join(" ")}>
                    {imgBox({
                        index: 0,
                        className: view({ class: "inline-block", size: "w_half" }),
                        classNameImage: view({ class: "rounded-l-3xl" })
                    })}
                    <div className="w-1/2 h-full m-0 inline-block">
                        {imgBox({
                            index: 1,
                            className: view({ size: "h_half" }),
                            classNameImage: view({ class: "rounded-tr-3xl" })
                        })}
                        {imgBox({
                            index: 2,
                            className: view({ size: "h_half" }),
                            classNameImage: view({ class: "rounded-br-3xl" })
                        })}
                    </div>
                </div>)
            case 3:
                return (<div className={[
                    "h-full", "m-0"
                ].join(" ")}>
                    <div className="w-1/2 h-full m-0 inline-block">
                        {imgBox({
                            index: 0,
                            className: view({ size: "h_half" }),
                            classNameImage: view({ class: "rounded-tl-3xl" })
                        })}
                        {imgBox({
                            index: 2,
                            className: view({ size: "h_half" }),
                            classNameImage: view({ class: "rounded-bl-3xl" })
                        })}
                    </div>
                    <div className="w-1/2 h-full m-0 inline-block">
                        {imgBox({
                            index: 1,
                            className: view({ size: "h_half" }),
                            classNameImage: view({ class: "rounded-tr-3xl" })
                        })}
                        {imgBox({
                            index: 3,
                            className: view({ size: "h_half" }),
                            classNameImage: view({ class: "rounded-br-3xl" })
                        })}
                    </div>
                </div>)
            default:
                break;
        }
    }

    return (
        <div className="aspect-video rounded-3xl border-2 mb-0 p-2 relative">
            {
                imageFiles.length > 0 ? (
                    <>
                        {imgFrame(imageFiles.length - 1)}
                    </>
                ) : (
                    <div className="h-fit w-fit m-auto align-middle absolute top-0 bottom-0 right-0 left-0">
                        画像のプレビューが表示されます
                    </div>
                )
            }
        </div>
    )
}
export default Component
