import { Dispatch, SetStateAction } from "react"
import { inputtext_base } from "../tailwind_variants"

const Component = ({ post, setPost }: {
    post: string
    setPost: Dispatch<SetStateAction<string>>
}) => {
    return (
        <div>
            <textarea onChange={(event) => setPost(event.target.value)}
                value={post}
                maxLength={300}
                className={inputtext_base({ class: "mt-1 md-1 mr-1 w-full md:w-lg resize-y" })} />
        </div>
    )
}
export default Component