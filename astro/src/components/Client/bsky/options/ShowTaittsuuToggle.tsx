import ToggleSwitch from "../ToggleSwitch"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { readShowTaittsuu, setShowTaittsuu } from "@/utils/localstorage"

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
            initialValue={readShowTaittsuu(false)}
            setPropConfig={setShowTaittsuu}
            labeltext={labeltext} />
    )
}
export default Component
