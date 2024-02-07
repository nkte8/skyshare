import { button_base } from "../common/tailwind_variants"
import { pagesPrefix } from "@/utils/vars"
const siteurl = location.origin
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
        const tweetext = encodeURIComponent(context)
        window.open(
            `https://twitter.com/intent/tweet?text=${tweetext}${(
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
                enabled: twiurl !== null,
                allowinput: twiurl !== null,
                color: "sky"
            })}
                onClick={handleClick} disabled={!(twiurl !== null)}>
                    Xへポスト
            </button>
        </>
    )
}
export default Component