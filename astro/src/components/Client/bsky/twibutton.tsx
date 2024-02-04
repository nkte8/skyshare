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
                <div>
                    Xへポスト
                </div>
            </button>
        </>
    )
}
export default Component