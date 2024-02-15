export type intentInfo = {
    kind: "xcom" | "taittsuu",
    intent: Array<
        {
            hard: string,
            url: string
        }>,
    default: string
}
