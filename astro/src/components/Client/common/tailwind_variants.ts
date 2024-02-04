import { tv } from "tailwind-variants";

export const link = tv({
	base: "text-sky-500 hover:text-red-300",
	variants: {
		enabled: {
			true: "",
			false: "text-gray-600 hover:text-gray-600"
		}
	}
});

export const inputtext_base = tv({
	base: "border-2 rounded-md px-1 my-1 focus:outline-none text-xl md:text-lg",
	variants: {
		disabled: {
			true: "bg-gray-200 text-gray-600",
			false: ""
		}
	}
});

export const button_base = tv({
	base: "border-2 rounded-full px-6 py-1 mx-px font-medium sm:font-normal hover:bg-gray-200 text-black",
	variants: {
		color: {
			blue: "bg-blue-500 hover:bg-blue-700 text-white",
			sky: "bg-sky-400 hover:bg-sky-600 text-white"
		},
		enabled: {
			true: "cursor-pointer",
			false: "hover:bg-gray-200 bg-gray-200 cursor-progress text-gray-700 hover:text-gray-700"
		},
		allowinput: {
			true: "",
			false: "cursor-not-allowed"
		},
		hidden: {
			true: "hidden",
			false: ""
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