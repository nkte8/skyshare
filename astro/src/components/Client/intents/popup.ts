import { intentInfo } from "./types"
const intentUrls: Array<intentInfo> = [
    {
        kind: "xcom",
        intent: [
            {
                hard: "android",
                url: "intent://post?message=CONTENT#Intent;scheme=twitter;package=com.twitter.android;end;"
            }
        ],
        default: "https://twitter.com/intent/tweet?text=CONTENT"
    }, {
        kind: "taittsuu",
        intent: [],
        default: "https://taittsuu.com/share?text=CONTENT"
    }
]

const XPopup = ({
    intentKind,
    content,
}: {
    intentKind: intentInfo["kind"]
    content: string
}) => {
    const ua = window.navigator.userAgent.toLowerCase();
    const tweetext = encodeURIComponent(content)
    const intentInfo = intentUrls.find((value) => (value.kind === intentKind))
    let intentDefine: string | null = null
    if (typeof intentInfo !== "undefined") {
        intentInfo.intent.forEach((value) => {
            if (ua.indexOf(value.hard) > 0) {
                intentDefine = value.url
            }
        })
        if (intentDefine === null) {
            intentDefine = intentInfo.default
        }
        window.open(
            `${intentDefine.replace("CONTENT", tweetext)}`, '_blank', '')
    }
}

export default XPopup