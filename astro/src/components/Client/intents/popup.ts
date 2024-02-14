import { intentInfo } from "./types"
const intentUrls = [
    {
        kind: "xcom",
        url: "https://twitter.com/intent/tweet?text="
    }, {
        kind: "taittsuu",
        url: "https://taittsuu.com/share?text="
    }
]

const XPopup = ({
    intentKind,
    content,
}: {
    intentKind: intentInfo["kind"]
    content: string
}) => {
    const tweetext = encodeURIComponent(content)
    const intentInfo = intentUrls.find((value) => (value.kind === intentKind))
    window.open(
        `${intentInfo?.url}${tweetext}`, '_blank', '')
}

export default XPopup