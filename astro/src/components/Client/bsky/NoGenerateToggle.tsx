import ToggleSwitch from "./ToggleSwitch"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { readNoGenerate, setNoGenerate } from "@/utils/localstorage"

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
            initialValue={readNoGenerate(false)}
            setPropConfig={setNoGenerate}
            labeltext={labeltext} />
    )
}
export default Component
