import { ReactNode, useState } from "react"
import { button_base } from "../common/tailwind_variants"
import XPopup from "./xpopup"

export const Component = ({
    content,
    disabled,
    labeltext,
    clikedtext,
}: {
    content: string,
    disabled: boolean,
    labeltext: ReactNode,
    clikedtext: ReactNode
}) => {
    const [clicked, setCliked] = useState<ReactNode>(<></>)
    const [color, setColor] = useState<"sky" | "blue" | "gray">("sky")
    const handleClick = () => {
        XPopup({
            content
        })
        setCliked(clikedtext)
        setColor("gray")
    }
    return (
        <>
            <button className={button_base({
                disabled: disabled,
                regectinput: disabled,
                color: color
            })}
                onClick={handleClick} disabled={disabled}>
                {labeltext}
                {clicked}
            </button>
        </>
    )
}
export default Component