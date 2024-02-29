import { Dispatch, SetStateAction } from "react";
const langList = [
    {
        label: "日本語",
        code: "ja"
    }, {
        label: "English",
        code: "en"
    }, {
        label: "中文",
        code: "zh"
    }, {
        label: "한국어",
        code: "ko"
    }];
export const Component = ({
    disabled,
    setLanguage
}: {
    disabled: boolean,
    setLanguage: Dispatch<SetStateAction<Array<string>>>,
}) => {
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let value: Array<string> = []
        const item = langList.find((opt) => opt.label === event.target.value)
        if (typeof item !== "undefined") {
            value = [item.code]
        }
        setLanguage(value)
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
                        "pl-4", "pr-6", "py-1",
                        "bg-white",
                        "rounded-lg",
                        "disabled:bg-gray-200"].join(" ")}>
                    {langList.map((value) => {
                        return (
                            <option key={value.code}>
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
