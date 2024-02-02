import { load_circle, button_base } from "./tailwind_variants"

const Component = ({
    handler, isProcessing, context, showAnimation = true, className
}: {
    handler: () => void,
    isProcessing: boolean,
    context: string,
    showAnimation?: boolean,
    className?: string
}) => {
    return (
        <button onClick={handler}
            className={button_base({ enabled: !isProcessing, class: "my-1 mx-px " + className })}
            type="button" disabled={isProcessing}>

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
