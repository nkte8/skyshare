import { Dispatch, SetStateAction, useState, useEffect } from "react"
import { type modes } from "./types"
import Button from "./procButton"

const Component = ({ mode, setMode, disabled }: {
    disabled: boolean
    mode: modes
    setMode: Dispatch<SetStateAction<modes>>
}
) => {
    const [label, setLabel] = useState<string>("")
    const swichLabel = () => {
        switch (mode) {
            case "bsky":
                setLabel("OGPページ一覧へ")
                break
            case "pagedb":
                setLabel("SNS投稿画面へ")
                break
        }
    }
    const handleClick = () => {
        switch (mode) {
            case "bsky":
                setMode("pagedb")
                break
            case "pagedb":
                setMode("bsky")
                break
        }
    }

    useEffect(() => {
        swichLabel()
    }, [mode])

    return (
        <Button
            handler={handleClick}
            isProcessing={false}
            context={label}
            showAnimation={false}
            disabled={disabled} />
    )
}
export default Component