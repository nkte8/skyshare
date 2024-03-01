import { useState, ReactNode, useEffect } from 'react'
import { link } from "../common/tailwind_variants";

const Component = ({
    children,
    initHidden,
}: {
    children: ReactNode
    initHidden: boolean
}) => {
    const [hidden, setHidden] = useState<boolean>(true)
    const onClick = () => {
        setHidden(!hidden)
    }
    useEffect(() => {
        setHidden(initHidden)
    }, [initHidden])
    return (
        <>
            <button className={link({ class: "block text-sm" })}
                onClick={onClick}>実験的な機能{hidden ? ("▼") : ("△")}</button>
            <div className={`transition-all pt-1 ${hidden ? ("hidden h-0") : ("h-full")}`}>
                {children}
            </div>
        </>
    )
}

export default Component