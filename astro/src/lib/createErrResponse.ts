import { errorResponse } from "./types"

const createErrResponse = ({
    statusCode
}: {
    statusCode: number
}): errorResponse => {
    let response: errorResponse
    switch (statusCode) {
        case 405:
            response = <errorResponse>{
                error: "Method Not Allowed",
                message: "Invalid method requested. API allow GET only."
            }
            break
        case 406:
            response = <errorResponse>{
                error: "Not Acceptable",
                message: "Invalid parameter requested. Check your request."
            }
            break
        case 502:
            response = <errorResponse>{
                error: "Bad Gateway",
                message: "Failed to get correct response from gateway. Announce server administrator."
            }
            break
        case 500:
            response = <errorResponse>{
                error: "Internal Server Error",
                message: "Failed to internal process. Announce server administrator."
            }
            break
        default:
            response = <errorResponse>{
                error: "Unexpected Error",
                message: "Unexpected Error occured."
            }
    }
    response.status = statusCode
    response.type = "error"
    return response
}
export default createErrResponse
