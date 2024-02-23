/**
 * エラー文字列を返却する
 * @param {number} code RFC7231定義のHTTPエラーコード
 */
const errRes = (code: number):{
    error: string,
    message: string
} => {
    let error: string = ""
    let message: string = ""
    switch (code) {
        case 401:
            error = "Unauthorized"
            message = "Bluesky Authorication failed."
            break
        case 405:
            error = "Method Not Allowed"
            message = "Invalid method requested. API only allow POST."
            break
        case 406:
            error = "Not Acceptable"
            message = "Invalid data requested. Check request body."
            break
        case 500:
            error = "Internal Server Error"
            message = "Failed to start process. Announce server administrator."
            break
        case 502:
            error = "Bad Gateway"
            message = "Failed to get correct response from gateway. Announce server administrator."
            break
    }
    return {
        error: error,
        message: message
    }
}
export default errRes