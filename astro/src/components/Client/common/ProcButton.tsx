import { buttonID } from "../bsky/types"
import { clickedButtonContext } from "./contexts"
import { load_circle, button_base } from "./tailwind_variants"
import { ReactNode, useContext } from "react"

const Component = ({
    handler,
    buttonID,
    isProcessing,
    context,
    showAnimation = true,
    className,
    disabled = false,
    color,
    hidden,
}: {
    handler: () => void,
    buttonID?: buttonID
    isProcessing: boolean,
    context: ReactNode,
    showAnimation?: boolean,
    className?: string,
    disabled?: boolean,
    hidden?: boolean,
    color?: "blue",
}) => {
    const { clickedButtonID, setClickedButtonID } = useContext(clickedButtonContext)
    const handlerWrapper = (callback: () => void) => {
        callback()
        const thisButtonID = (typeof buttonID !== "undefined") ? buttonID : ""
        setClickedButtonID(thisButtonID)
    }
    const Animation = clickedButtonID !== "" && clickedButtonID === buttonID && showAnimation
    return (
        <button onClick={() => handlerWrapper(handler)}
            className={button_base({
                disabled: (isProcessing || disabled),
                regectinput: disabled,
                class: "my-1 mx-px " + className,
                color: color,
                hidden: hidden,
                noshadow: disabled
            })}
            type="button" disabled={(isProcessing || disabled)}>

            {
                isProcessing ? (
                    <>{
                        Animation && <>
                            <svg className={load_circle({ size: "s" })}
                                viewBox="-30 -30 160 160" xmlns="http://www.w3.org/2000/svg">
                                <path d="M94,50 a44,44,0,1,1,-44,-44"
                                    stroke="#7dd3fc" fill="none"
                                    strokeWidth="20" strokeLinecap="round" />
                            </svg>
                        </>
                    }
                        <span>{context}</span>
                    </>
                ) : (
                    <span>{context}</span>
                )
            }
        </button>
    )
}
export default Component
