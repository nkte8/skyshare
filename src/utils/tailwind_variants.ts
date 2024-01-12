import { tv } from "tailwind-variants";
export const subject = tv({
	base: "mb-4 text-gray-900",
	variants: {
		size: {
			xl: "md:text-4xl text-3xl font-medium",
			l: "md:text-3xl text-2xl",
			m: "md:text-2xl text-xl",
		},
	},
});
export const link = tv({
	base: "text-sky-500 hover:text-red-300",
});