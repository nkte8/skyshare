import { tv } from "tailwind-variants";

export const link = tv({
	base: "text-sky-500 hover:text-red-300",
});

export const inputtext_base = tv({
	base: "border-2 rounded-md px-1 focus:outline-none",
});

export const button_base = tv({
	base: "border-2 rounded-md px-3 py-1 ",
	variants: {
		mode: {
			true: "hover:bg-gray-200",
			false: "bg-gray-200",
		}
	}
})

export const load_circle = tv({
	base: "animate-spin inline-block",
	variants: {
		size: {
			s: "h-6 w-6",
			l: "h-24 w-24",
		}
	}
})