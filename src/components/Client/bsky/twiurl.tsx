import { link, button_base } from "../tailwind_variants"
import { siteurl } from "@/utils/vars"
export const Component = ({
    twiurl, context
}: {
    twiurl: string | null,
    context: string
}) => {
    return (
        <>
            {
                twiurl !== null && (
                    <a target="_blank"
                        className={link()}
                        href={`https://twitter.com/intent/tweet?text=${context}${
                            twiurl !== "" ? ("&url=" + new URL(`posts/${twiurl}/`, siteurl)) : ("")
                            }`}>
                        <button className={button_base({ mode: true })}>
                            X.com(Twitter)へ投稿する
                        </button>
                    </a >
                )
            }
        </>
    )
}
export default Component