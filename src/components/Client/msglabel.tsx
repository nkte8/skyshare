import {
    type msgInfo,
} from "./contexts"

const Component = ({
    msgInfo
}: {
    msgInfo: msgInfo
}
) => {

    return (
        <>
            {
                msgInfo.msg !== "" && (
                    <div className="mb-2">
                        <span className={msgInfo.isError ?
                            "bg-red-300 px-5 py-1 text-white rounded-xl" :
                            "bg-sky-200 px-5 py-1 rounded-xl"}>
                            {msgInfo.msg}
                        </span>
                    </div>
                )
            }
        </>
    )
}
export default Component