import { tv } from "tailwind-variants";
export const link = tv({
	base: "text-sky-400 hover:text-blue-600 font-medium",
	variants: {
		x: {
			true: "hover:text-gray-950"
		}
	}
});

export const load_circle = tv({
	base: "animate-spin inline-block",
	variants: {
		size: {
			s: "h-6 w-6",
			l: "h-24 w-24",
		}
	}
})

export const box = tv({
	base: "bg-white bg-opacity-80 rounded-lg w-fit px-4 py-2 m-auto"
})