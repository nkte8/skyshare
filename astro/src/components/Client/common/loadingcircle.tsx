
import { load_circle } from "./tailwind_variants";
const Component = ({
    size
}:{
    size: "s" | "l"
}) => {
    return (
        <svg
            className={load_circle({ size: size })}
            viewBox="-30 -30 160 160"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M94,50 a44,44,0,1,1,-44,-44"
                stroke="#7dd3fc"
                fill="none"
                strokeWidth="14"
                strokeLinecap="round"></path>
        </svg>
    )
}
export default Component