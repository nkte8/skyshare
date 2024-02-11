import ToggleSwitch from "./ToggleSwitch"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { readAutoXPopup, setAutoXPopup } from "@/utils/localstorage"

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
            initialValue={readAutoXPopup(false)}
            setPropConfig={setAutoXPopup}
            labeltext={labeltext} />
    )
}
export default Component
