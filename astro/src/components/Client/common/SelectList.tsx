import { Dispatch, SetStateAction } from "react"

type CodeMap<CodeType> = {
    label: string
    code: CodeType
}
export const Component = <CodeType,>({
    disabled,
    setCode,
    codeMap,
}: {
    disabled: boolean
    setCode: Dispatch<SetStateAction<CodeType>>
    codeMap: CodeMap<CodeType>[]
}) => {
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (codeMap.length === 0) {
            return
        }

        const item: CodeMap<CodeType> | undefined = codeMap.find(
            opt => opt.label === event.target.value,
        )
        const code: CodeType | undefined = item?.code ?? codeMap[0]?.code

        if (typeof code !== "undefined") {
            setCode(code)
        }
    }
    return (
        <div
            className={[
                "p-0",
                "h-8",
                "text-sm",
                "my-auto",
                "rounded-lg",
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
                "after:pointer-events-none",
            ].join(" ")}
        >
            <select
                onChange={handleSelect}
                disabled={disabled}
                className={[
                    "appearance-none",
                    "block",
                    "h-full",
                    "w-full",
                    "pl-2",
                    "pr-6",
                    "py-1",
                    "bg-white",
                    "rounded-lg",
                    "disabled:bg-gray-200",
                ].join(" ")}
            >
                {codeMap.map(value => {
                    return <option key={value.label}>{value.label}</option>
                })}
            </select>
        </div>
    )
}
export default Component
