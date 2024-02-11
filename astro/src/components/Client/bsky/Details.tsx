import { useState, ReactNode, useEffect } from 'react'
import { link } from "../common/tailwind_variants";

const Component = ({
    children,
    initValue,
}: {
    children: ReactNode
    initValue: boolean
}) => {
    const [hidden, setHidden] = useState<boolean>(true)
    const onClick = () => {
        setHidden(!hidden)
    }
    useEffect(() => {
        setHidden(initValue)
    }, [initValue])
    return (
        <>
            <button className={link({ class: "block" })}
                onClick={onClick}>高度な設定{hidden ? ("▼") : ("△")}</button>
            <div className={`transition-all pt-2 ${hidden ? ("hidden h-0") : ("h-full")}`}>
                {children}
            </div>
        </>
    )
}

export default Component