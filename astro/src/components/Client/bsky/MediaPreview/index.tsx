import { tv } from "tailwind-variants";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import DeleteItemButton from "./DeleteItemButton"
import { MediaData } from "../type";

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
    mediaDataList,
    setMediaDataList,
}: {
    mediaDataList: MediaData | null,
    // 配列を操作するだけなのでArray型さえ担保されていれば良い
    setMediaDataList: Dispatch<SetStateAction<MediaData | null>>
}) => {
    // プレビューを構成するコンポーネント
    const PreviewNode = ({
        index,
        classNameImage,
        className
    }: {
        index: number,
        classNameImage?: string,
        className?: string
    }) => {
        const mediaBlob =
            mediaDataList !== null ?
                mediaDataList.blobs[index].blob
                : null

        const alt =
            mediaDataList !== null &&
                mediaDataList.type === "images" ?
                mediaDataList.blobs[index].alt : undefined
        return (
            <div className={"relative " + className}>
                <DeleteItemButton
                    itemId={index}
                    mediaDataList={mediaDataList}
                    setMediaDataList={setMediaDataList} />
                {
                    mediaBlob !== null &&
                    <img
                        src={URL.createObjectURL(mediaBlob)}
                        alt={alt}
                        className={classNameImage}
                    />
                }
            </div>
        )
    }
    const PreviewLayout = (index: number): ReactNode => {
        switch (index) {
            case 0:
                return (
                    <div className="h-fit w-fit m-auto align-middle absolute top-0 bottom-0 right-0 left-0">
                        プレビューが表示されます
                    </div>
                )
            case 1:
                return (<div className="w-full h-full m-0">
                    {PreviewNode({
                        index: 0,
                        className: view({ class: "inline-block" }),
                        classNameImage: view({ class: "rounded-3xl" })
                    })}
                </div>)
            case 2:
                return (<div className="w-full h-full m-0">
                    {PreviewNode({
                        index: 0,
                        className: view({ class: "inline-block", size: "w_half" }),
                        classNameImage: view({ class: "rounded-l-3xl" })
                    })}
                    {PreviewNode({
                        index: 1,
                        className: view({ class: "inline-block", size: "w_half" }),
                        classNameImage: view({ class: "rounded-r-3xl" })
                    })}
                </div>)
            default:
                break;
        }
    }
    const [PreviewForm, setPreviewForm] = useState<ReactNode>(PreviewLayout(-1))

    useEffect(() => {
        if (mediaDataList !== null) {
            if (mediaDataList.type === "external") {
                setPreviewForm(PreviewLayout(
                    mediaDataList.blobs !== null ? 1 : 0
                ))
            }
            if (mediaDataList.type === "images") {
                setPreviewForm(PreviewLayout(mediaDataList.blobs.length))
            }
        } else {
            setPreviewForm(PreviewLayout(0))
        }
    }, [mediaDataList])

    return (
        <div className="aspect-video rounded-3xl border-2 p-2 relative">
            {PreviewForm}
        </div>
    )
}
export default Component
