import { tv } from "tailwind-variants";

const view = tv({
    base: "object-cover border-2 border-white w-full h-full",
    variants: {
        size: {
            w_half: "w-1/2 h-full",
            h_half: "h-1/2 w-full",
            half: "w-1/2 h-1/2"
        }
    }
})

const Component = ({
    imageFiles,
}: {
    imageFiles: Array<File> | null,
}) => {
    const comp_1 = (files: Array<File>) => (
        <div className="aspect-video flex mb-0 w-full">
            <img
                src={URL.createObjectURL(files[0])}
                alt={files[0].name}
                className={view({ class: "rounded-3xl" })}
            />
        </div>
    )
    const comp_2 = (files: Array<File>) => (
        <div className="aspect-video flex mb-0 w-full">
            <img
                src={URL.createObjectURL(files[0])}
                alt={files[0].name}
                className={view({ class: "rounded-l-3xl", size: "w_half" })}
            />
            <img
                src={URL.createObjectURL(files[1])}
                alt={files[1].name}
                className={view({ class: "rounded-r-3xl", size: "w_half" })}
            />
        </div>
    )
    const comp_3 = (files: Array<File>) => (
        <div className="aspect-video flex mb-0 w-full">
            <img
                src={URL.createObjectURL(files[0])}
                alt={files[0].name}
                className={view({ class: "rounded-l-3xl", size: "w_half" })}
            />
            <div className="w-1/2 h-full mb-0">
                <img
                    src={URL.createObjectURL(files[1])}
                    alt={files[1].name}
                    className={view({ class: "rounded-tr-3xl", size: "h_half" })}
                />
                <img
                    src={URL.createObjectURL(files[2])}
                    alt={files[2].name}
                    className={view({ class: "rounded-br-3xl", size: "h_half" })}
                />
            </div>
        </div>
    )

    const comp_4 = (files: Array<File>) => (
        <div className="aspect-video flex mb-0 w-full">
            <div className="w-1/2 h-full mb-0">
                <img
                    src={URL.createObjectURL(files[0])}
                    alt={files[0].name}
                    className={view({ class: "rounded-tl-3xl", size: "h_half" })}
                />
                <img
                    src={URL.createObjectURL(files[2])}
                    alt={files[2].name}
                    className={view({ class: "rounded-bl-3xl", size: "h_half" })}
                />
            </div>
            <div className="w-1/2 h-full mb-0">
                <img
                    src={URL.createObjectURL(files[1])}
                    alt={files[1].name}
                    className={view({ class: "rounded-tr-3xl", size: "h_half" })}
                />
                <img
                    src={URL.createObjectURL(files[3])}
                    alt={files[3].name}
                    className={view({ class: "rounded-br-3xl", size: "h_half" })}
                />
            </div>
        </div>

    )
    return (
        <>
            <div className="rounded-3xl border-2 mb-0 p-2">
                {
                    imageFiles ? (
                        imageFiles.length == 1 ? (
                            comp_1(imageFiles)
                        ) : (
                            imageFiles.length == 2 ? (
                                comp_2(imageFiles)
                            ) : (
                                imageFiles.length == 3 ? (
                                    comp_3(imageFiles)
                                ) : (
                                    comp_4(imageFiles)
                                )
                            )
                        )
                    ) : (
                        <>
                            画像のプレビューが表示されます
                        </>
                    )
                }

            </div>
        </>
    )
}
export default Component
