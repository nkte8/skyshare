import ToggleSwitch from "../ToggleSwitch"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { readForceIntent, setForceIntent } from "@/utils/localstorage"

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
            initialValue={readForceIntent(false)}
            setPropConfig={setForceIntent}
            labeltext={labeltext} />
    )
}
export default Component
