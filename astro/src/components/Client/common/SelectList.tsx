import { Dispatch, SetStateAction } from "react";

type codeMap = {
    label: string,
    code: any,
}
export const Component = ({
    disabled,
    setCode,
    codeMap
}: {
    disabled: boolean,
    setCode: Dispatch<SetStateAction<any>>,
    codeMap: Array<codeMap>
}) => {
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let value: any = null
        const item = codeMap.find((opt) => opt.label === event.target.value)
        if (typeof item !== "undefined") {
            value = item.code
        }
        setCode(value)
    }
    return (
        <>
            <div className={[
                "p-0", "h-8", "text-sm",
                "my-auto", "rounded-lg",
                "relative",
                "border-2",
                "after:my-auto",
                "after:content-['▼']",
                "after:absolute",
                "after:right-2",
                "after:top-0",
                "after:bottom-0",
                "after:h-fit",
                "after:text-gray-300",
                "after:pointer-events-none"
            ].join(" ")}>
                <select
                    onChange={handleSelect}
                    disabled={disabled}
                    className={[
                        "appearance-none",
                        "block", "h-full", "w-full",
                        "pl-2", "pr-6", "py-1",
                        "bg-white",
                        "rounded-lg",
                        "disabled:bg-gray-200"
                    ].join(" ")}>
                    {codeMap.map((value) => {
                        return (
                            <option key={value.label}>
                                {value.label}
                            </option>
                        )
                    })}
                </select>
            </div>
        </>
    )
}
export default Component
