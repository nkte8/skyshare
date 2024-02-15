import { intentInfo } from "./types"
import { readForceIntent } from "@/utils/localstorage"

const intentUrls: Array<intentInfo> = [
    {
        kind: "xcom",
        intent: [
            {
                hard: "android",
                url: "intent://post?message=CONTENT#Intent;scheme=twitter;package=com.twitter.android;end;"
            },
            {
                hard: "iphone",
                url: "twitter://post?message=CONTENT"
            },
            {
                hard: "ipad",
                url: "twitter://post?message=CONTENT"
            }
        ],
        default: "https://twitter.com/intent/tweet?text=CONTENT"
    }, {
        kind: "taittsuu",
        intent: [],
        default: "https://taittsuu.com/share?text=CONTENT"
    }
]

const Popup = ({
    intentKind,
    content,
}: {
    intentKind: intentInfo["kind"]
    content: string
}): void => {
    const ua = window.navigator.userAgent.toLowerCase();
    const tweetext = encodeURIComponent(content)
    const intentInfo = intentUrls.find((value) => (value.kind === intentKind))
    if (typeof intentInfo !== "undefined") {
        let intentDefine: string = intentInfo.default
        // Intent forceフラグが付いた場合、強制的にハードウェア依存のintentURLを使用する
        if (readForceIntent(false) === true) {
            intentInfo.intent.forEach((value) => {
                if (ua.indexOf(value.hard) > 0) {
                    intentDefine = value.url
                }
            })
        }
        window.open(
            `${intentDefine.replace("CONTENT", tweetext)}`, '_blank', '')
    } else {
        let e: Error = new Error("intentInfoへ対応していないサービスが指定されました。")
        e.name = "popup.ts"
        throw e
    }
}

export default Popup