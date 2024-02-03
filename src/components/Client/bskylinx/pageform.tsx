import { useEffect, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"
import { pagesPrefix, siteurl } from "@/utils/vars"
import getIds from "@/utils/bskylinx_api/geIds"
import { Session_context, type msgInfo } from "../common/contexts"
import { load_circle, link } from "../common/tailwind_variants"

const Component = ({
    setMsgInfo
}: {
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
}) => {
    const { session } = useContext(Session_context)

    const error: ReactNode = (
        <>
            <div>Failed to Load pages.</div>
        </>
    )
    const [list, setList] = useState<ReactNode>(
        <>
            <svg className={load_circle({ size: "l" })} viewBox="-30 -30 160 160" xmlns="http://www.w3.org/2000/svg">
                <path d="M94,50 a44,44,0,1,1,-44,-44"
                    stroke="#7dd3fc" fill="none"
                    strokeWidth="14" strokeLinecap="round" />
            </svg>
        </>
    )

    const pageIds = async () => {
        try {
            const ids = await getIds({
                handle: session.handle!
            })
            if (typeof ids?.error != "undefined" ||
                typeof ids?.message != "undefined") {
                setList(error)
                setMsgInfo({
                    isError: true,
                    msg: "投稿一覧の読み込みに失敗しました..."
                })
                return
            }

            setMsgInfo({
                isError: false,
                msg: "投稿一覧を読み込みました!"
            })
            setList(
                <div className="mx-auto">
                    <div>OGP生成したページ一覧</div>
                    <div className="grid sm:grid-cols-3 grid-cols-1">
                        {ids.ids.map((value) => {
                            return (
                                <div className=" bg-white rounded-lg px-2 py-1 m-1 border-2">
                                    <a className={link()} target="_blank"
                                        href={
                                            new URL(pagesPrefix + "/" + value + "/", siteurl).toString()
                                        }>
                                        ID:{value.split(/(_|@)/).at(-1)}
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        } catch (e) {
            setList(error)
            setMsgInfo({
                isError: true,
                msg: "Unexpected error..."
            })
        }
    }

    useEffect(() => {
        pageIds()
    }, [])

    return (
        <>
            {list}
        </>
    )
}
export default Component