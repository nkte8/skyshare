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
                    <div className="mx-auto w-fit">
                        <div className={msgInfo.isError ?
                            "bg-red-300 px-5 py-1 text-white rounded-xl" :
                            "bg-sky-200 px-5 py-1 rounded-xl w-fit"}>
                            {msgInfo.msg}
                        </div>
                    </div>
                )
            }
        </>
    )
}
export default Component