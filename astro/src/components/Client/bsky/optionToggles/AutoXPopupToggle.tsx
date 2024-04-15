// utils
import { Dispatch, ReactNode, SetStateAction } from "react"

// components
import ToggleSwitch from "../../common/ToggleSwitch"

// service
import { readAutoXPopup, setAutoXPopup } from "@/utils/useLocalStorage"

const Component = ({
    labeltext,
    prop,
    setProp,
}: {
    labeltext: ReactNode
    prop: boolean
    setProp: Dispatch<SetStateAction<boolean>>
}) => {
    return (
        <ToggleSwitch
            prop={prop}
            setProp={setProp}
            initialValue={readAutoXPopup(false)}
            setPropConfig={setAutoXPopup}
            labeltext={labeltext}
        />
    )
}
export default Component
