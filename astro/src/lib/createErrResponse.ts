import { errorResponse } from "./types"

const createErrResponse = ({
    statusCode
}: {
    statusCode: number
}): Response => {
    let response: Response
    switch (statusCode) {
        case 405:
            response = new Response(
                JSON.stringify(<errorResponse>{
                    error: "Method Not Allowed",
                    message: "Invalid method requested. API allow GET only."
                }), {
                status: statusCode
            })
            break
        case 406:
            response = new Response(
                JSON.stringify(<errorResponse>{
                    error: "Not Acceptable",
                    message: "Invalid parameter requested. Check your request."
                }), {
                status: statusCode
            })
            break
        case 502:
            response = new Response(
                JSON.stringify(<errorResponse>{
                    error: "Bad Gateway",
                    message: "Failed to get correct response from gateway. Announce server administrator."
                }), {
                status: statusCode
            })
            break
        case 500:
            response = new Response(
                JSON.stringify(<errorResponse>{
                    error: "Internal Server Error",
                    message: "Failed to internal process. Announce server administrator."
                }), {
                status: statusCode
            })
            break
        default:
            response = new Response(
                JSON.stringify(<errorResponse>{
                    error: "Unexpected Error",
                    message: "Unexpected Error occured."
                }), {
                status: statusCode
            })
    }
    return response
}
export default createErrResponse
