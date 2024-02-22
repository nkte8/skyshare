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
            <select
                onChange={handleSelect}
                disabled={disabled}
                className="text-sm h-6 my-auto">
                {langList.map((value) => {
                    return (
                        <option key={value.code}>
                            {value.label}
                        </option>
                    )
                })}
            </select>
        </>
    )
}
export default Component
