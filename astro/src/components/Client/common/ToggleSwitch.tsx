import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react"

const Component = ({
    labeltext,
    prop,
    setProp,
    initialValue,
    setPropConfig,
}: {
    labeltext: ReactNode
    prop: boolean,
    setProp: Dispatch<SetStateAction<boolean>>
    initialValue: boolean
    setPropConfig: (flag: boolean) => void
}) => {
    const inputRef = useRef<HTMLInputElement>(null!);
    const handleClick = () => { inputRef.current.click() }

    const setPropAll = (checked: boolean) => {
        setProp(checked)
        setPropConfig(checked)
    }
    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.currentTarget.checked
        setPropAll(checked)
    }
    const handleLoaded = () => {
        setPropAll(initialValue)
    }
    useEffect(() => {
        handleLoaded()
    }, [initialValue])

    return (
        <>
            <div className="mr-2 my-auto flex">
                <input
                    ref={inputRef}
                    checked={prop}
                    onChange={handleCheck}
                    type="checkbox"
                    className="peer sr-only" />
                <label className="text-sm">{labeltext}:&nbsp;</label>
                <span onClick={handleClick}
                    className="my-auto block w-8 bg-gray-500 rounded-full p-[1px] 
                        after:block after:h-4 after:w-4 after:rounded-full 
                        after:bg-white after:transition 
                        peer-checked:bg-blue-500 
                        peer-checked:after:translate-x-[calc(100%-2px)]"
                >
                </span>
            </div>
        </>
    )
}
export default Component
