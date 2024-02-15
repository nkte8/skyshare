export type intentInfo = {
    kind: "xcom" | "taittsuu",
    intent: Array<
        {
            hard: "iphone" | "android" | "other",
            url: string
        }>,
    default: string
}
