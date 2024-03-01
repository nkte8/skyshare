import ToggleSwitch from "../ToggleSwitch"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { readAppendVia, setAppendVia } from "@/utils/localstorage"

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
            initialValue={readAppendVia(false)}
            setPropConfig={setAppendVia}
            labeltext={labeltext} />
    )
}
export default Component
