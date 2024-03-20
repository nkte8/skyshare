// utils
import { Dispatch, ReactNode, SetStateAction } from "react"

// components
import ToggleSwitch from "../../common/ToggleSwitch"

// service
import { readSavePassword, setSavePassword } from "@/utils/localstorage"

const Component = ({
    labeltext,
    prop,
    setProp
}: {
    labeltext: ReactNode,
    prop: boolean,
    setProp: Dispatch<SetStateAction<boolean>>
}) => {
    return (
        <ToggleSwitch
            prop={prop}
            setProp={setProp}
            initialValue={readSavePassword(false)}
            setPropConfig={setSavePassword}
            labeltext={labeltext} />
    )
}
export default Component
