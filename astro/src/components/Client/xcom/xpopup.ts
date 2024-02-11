
import { pagesPrefix } from "@/utils/vars"
const siteurl = location.origin

const XPopup = ({
    url,
    content,
}: {
    url: string,
    content: string
}) => {
    const tweetext = encodeURIComponent(content)
    window.open(
        `https://twitter.com/intent/tweet?text=${tweetext}${(
            url !== "" ? (
                "&url=" + url
            ) : (
                ""
            ))
        }`, '_blank', '')
}

export default XPopup