import { ReactNode } from "react"
import { button_base } from "../common/tailwind_variants"
import XPopup from "./xpopup"

export const Component = ({
    twiurl, 
    content, 
    disabled,
    labeltext,
}: {
    twiurl: string,
    content: string,
    disabled: boolean,
    labeltext: ReactNode
}) => {
    const handleClick = () => {
        XPopup({
            url: twiurl, 
            content
        })
    }
    return (
        <>
            <button className={button_base({
                disabled: disabled,
                regectinput: disabled,
                color: "sky"
            })}
                onClick={handleClick} disabled={disabled}>
                {labeltext}
            </button>
        </>
    )
}
export default Component