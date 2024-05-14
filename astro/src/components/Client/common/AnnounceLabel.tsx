import { readAnnounceClosed, setAnnounceClosed } from "@/utils/useLocalStorage"
import { useState } from "react"
import { button_base } from "./tailwindVariants"
import { skythrowurl } from "@/env/envs"

export const Component = () => {
    const refreshDate = new Date("2024-05-14").getTime()
    const [closed, setClosed] = useState(
        readAnnounceClosed(refreshDate).getTime() > refreshDate,
    )
    const handleClose = () => {
        setClosed(true)
        setAnnounceClosed(new Date().getTime())
    }
    return (
        <>
            {!closed && (
                <>
                    <div className="mx-auto max-w-xl my-1">
                        <div
                            className={[
                                "bg-sky-200",
                                "px-5",
                                "py-1",
                                "rounded-xl",
                                "w-full",
                                "flex",
                            ].join(" ")}
                        >
                            <div className="flex-1">
                                お知らせ:{" "}
                                <a href={skythrowurl}>
                                    Bluesky投稿専用クライアント「SkyThrow」の紹介
                                </a>
                            </div>
                            <button
                                className={button_base({
                                    className: [
                                        "p-0.5",
                                        "px-2",
                                        "rounded-full",
                                        "text-xs",
                                        "align-middle",
                                        "flex-none",
                                    ],
                                })}
                                onClick={handleClose}
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
export default Component
