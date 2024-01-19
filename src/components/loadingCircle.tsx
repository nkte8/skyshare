import { tv } from "tailwind-variants";
const load_circle = tv({
	base: "animate-spin inline-block",
	variants: {
		size: {
			s: "h-6 w-6",
			l: "h-24 w-24",
		}
	}
})

export const Component = () => {
    return (
        <>
            <svg className={load_circle({ size: "l" })} viewBox="-30 -30 160 160" xmlns="http://www.w3.org/2000/svg">
                <path d="M94,50 a44,44,0,1,1,-44,-44"
                    stroke="#7dd3fc" fill="none"
                    strokeWidth="14" strokeLinecap="round" />
            </svg>
        </>
    )
}
export default Component
