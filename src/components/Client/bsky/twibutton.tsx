import { link, button_base } from "../common/tailwind_variants"
import { siteurl, pagesPrefix } from "@/utils/vars"
export const Component = ({
    twiurl, context
}: {
    twiurl: string | null,
    context: string
}) => {
    const handleClick = () => {
        if (twiurl === null) {
            return
        }
        window.open(
            `https://twitter.com/intent/tweet?text=${context}${(
                twiurl !== "" ? (
                    "&url=" + new URL(`${pagesPrefix}/${twiurl}/`, siteurl)
                ) : (
                    ""
                ))
            }`, '_blank', '')
    }
    return (
        <>
            <button className={button_base({
                enabled: twiurl !== null ? (true) : ("bad")
            }) + " " + link({ enabled: (twiurl !== null) }) }
                onClick={handleClick} disabled={!(twiurl !== null)}>
                <div>
                    X.com(Twitter)へ投稿
                </div>
            </button>
        </>
    )
}
export default Component