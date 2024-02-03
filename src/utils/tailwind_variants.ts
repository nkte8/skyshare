import { tv } from "tailwind-variants";
export const subject = tv({
	base: "mb-4",
	variants: {
		size: {
			xl: "md:text-5xl text-4xl font-medium",
			l: "md:text-3xl text-2xl font-medium",
			m: "md:text-2xl text-xl",
		},
	},
});
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