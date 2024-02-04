import { load_circle, button_base } from "./tailwind_variants"
import { ReactNode } from "react"
const Component = ({
    handler,
    isProcessing,
    context,
    showAnimation = true,
    className,
    disabled = false,
    color,
    hidden,
}: {
    handler: () => void,
    isProcessing: boolean,
    context: ReactNode,
    showAnimation?: boolean,
    className?: string,
    disabled?: boolean,
    hidden?: boolean,
    color?: "blue",
}) => {
    return (
        <button onClick={handler}
            className={button_base({
                enabled: !(isProcessing || disabled),
                allowinput: !disabled,
                class: "my-1 mx-px " + className,
                color: color,
                hidden: hidden,
            })}
            type="button" disabled={(isProcessing || disabled)}>

            {
                isProcessing ? (
                    <>{
                        showAnimation && <>
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
