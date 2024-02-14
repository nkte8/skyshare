import { ReactNode, useState } from "react"
import { button_base } from "../common/tailwind_variants"
import Popup from "./popup"
import { intentInfo } from "./types"

export const Component = ({
    content,
    disabled,
    labeltext,
    clikedtext,
    intentKind,
    className,
}: {
    content: string,
    disabled: boolean,
    labeltext: ReactNode,
    clikedtext: ReactNode,
    intentKind: intentInfo["kind"],
    className?: string,
}) => {
    const [clicked, setCliked] = useState<ReactNode>(<></>)
    const [color, setColor] = useState<"sky" | "blue" | "gray">("sky")
    const handleClick = () => {
        Popup({
            intentKind,
            content,
        })
        setCliked(clikedtext)
        setColor("gray")
    }
    return (
        <>
            <button className={button_base({
                disabled: disabled,
                regectinput: disabled,
                color: color,
                class: className
            })}
                onClick={handleClick} disabled={disabled}>
                {labeltext}
                {clicked}
            </button>
        </>
    )
}
export default Component