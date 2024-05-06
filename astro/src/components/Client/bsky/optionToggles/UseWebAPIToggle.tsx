// utils
import { Dispatch, ReactNode, SetStateAction } from "react"

// components
import ToggleSwitch from "../../common/ToggleSwitch"

// service
import { readUseWebShareAPI, setUseWebShareAPI } from "@/utils/useLocalStorage"

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
            initialValue={readUseWebShareAPI(false)}
            setPropConfig={setUseWebShareAPI}
            labeltext={labeltext}
            isLocked={false}
        />
    )
}
export default Component
