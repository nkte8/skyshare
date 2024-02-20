import React, { memo, useRef, Dispatch, SetStateAction, useCallback, useState } from "react";
import { inputtext_base, link } from "../../common/tailwind_variants"


const Img = ({ file }: { file: File }) => {
    return (
        <img src={URL.createObjectURL(file)} className="max-w-md w-full mx-auto" />
    )
}
const MemoImg = memo(Img)

export const Component = ({
    itemId,
    file,
    altTexts,
    setAltText,
}: {
    itemId: number,
    file: File,
    altTexts: Array<string>,
    setAltText: Dispatch<SetStateAction<Array<string>>>
}) => {
    const ref = useRef<HTMLDialogElement | null>(null);
    const textref = useRef<HTMLTextAreaElement | null>(null);
    const [tempText, setTempText] = useState<string>("")
    const maxShowAltLength = 10

    const handleOpenDialog = () => {
        if (textref.current) {
            textref.current.value = altTexts[itemId]
        }
        if (ref.current) {
            ref.current.showModal()
        }
    };

    const handleCloseDialog = () => {
        if (ref.current) {
            ref.current.close();
        }
        let altNewTexts = altTexts
        altNewTexts[itemId] = tempText
        setAltText(altNewTexts)
    };

    const handleClickInDialog = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
        },
        []
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
        if (event.key === "Escape") {
            handleCloseDialog()
        }
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let altNewTexts = altTexts
        altNewTexts[itemId] = event.target.value
        setTempText(event.target.value)
    }

    const handleClick = () => {
        let altNewTexts = altTexts
        altNewTexts[itemId] = ""
        setAltText(altNewTexts)
        if (textref.current) {
            textref.current.value = ""
            setTempText("")
        }
    }

    return (
        <>
            <button
                onClick={handleOpenDialog}
                className={[
                    "rounded-lg",
                    "border-1",
                    "bg-opacity-70",
                    "px-2",
                    "bg-black",
                    "border-white",
                    "text-white",
                    "absolute",
                    "left-1",
                    "bottom-1",
                ].join(" ") + (
                        altTexts[itemId] !== "" ? (" bg-blue-500") : ("")
                    )}>
                {
                    altTexts[itemId] !== "" ? (
                        `${altTexts[itemId].slice(0, maxShowAltLength)
                        }${altTexts[itemId].length >= maxShowAltLength
                            ? ("...") : ("")}`
                    ) : (
                        "Altを設定"
                    )
                }
            </button>
            <dialog ref={ref}
                className="p-10 rounded-2xl"
                onClick={handleCloseDialog}
                onKeyDown={handleKeyDown}>
                <div onClick={handleClickInDialog} >
                    <MemoImg file={file} />
                    <label>画像に設定するAltを入力（ダイアログを閉じると反映）</label>
                    <textarea onChange={handleOnChange}
                        autoFocus={true}
                        ref={textref}
                        placeholder="上記に設定するAltを入力してください"
                        className={inputtext_base({
                            kind: "outbound",
                            class: "p-4 w-full md:w-lg resize-y overflow-y-auto h-32"
                        })}
                    />
                    <button
                        className={link({ enabled: !(tempText === "") })}
                        disabled={tempText === ""}
                        onClick={handleClick}
                    >内容をクリア</button>
                </div>
            </dialog>
        </>

    );
};

const memoComponent = memo(Component)
export default memoComponent