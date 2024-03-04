export type ogpMetaData = {
    type: "meta"
    title: string,
    description: string,
    image: string,
}
// APIのエラーレスポンスを定義
export type errorResponse = {
    type: "error"
    error: string,
    message: string
}
