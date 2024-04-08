import { Dispatch, SetStateAction } from "react";
import SelectList from "../../common/SelectList"
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
    }, {
        label: "polski",
        code: "pl"
    }, {
        label: "Deutsch",
        code: "de"
    }];
export const Component = ({
    disabled,
    setLanguage
}: {
    disabled: boolean,
    setLanguage: Dispatch<SetStateAction<string>>,
}) => {
    return (
        <>
            <SelectList 
                setCode={setLanguage}
                codeMap={langList}
                disabled={disabled}/>
        </>
    )
}
export default Component
