import { useState, useEffect } from "react"
import ReactDOM from "react-dom";
import { posturl } from "@/utils/vars"
import { Session_context, type Session_info } from "./common/contexts"
import ProcButton from "./common/procButton"
import LogoutButton from "./bsky/logout"
import Form from "./form"
import LoadSession from "./bsky/loadsession"
import PageControl from "./pagedb/pagecontrol"

const Component = ({
    portalonly = false
}: {
    portalonly?: boolean
}) => {
    const [isLoad, setIsLoad] = useState<boolean>(false)
    const [session, setSession] = useState<Session_info>({
        did: null,
        accessJwt: null,
        refreshJwt: null,
        handle: null,
    })
    const buttonstyle = "font-medium rounded-full hover:bg-sky-200 focus:outline-none bg-white"
    const handleClick = () => {
        location.href = posturl
    }
    const appElem = document.getElementById("app")
    const pageElem = document.getElementById("page")
    const handleLoaded = () => {
        const loadElem = document.getElementById("bload")
        const headerElem = document.getElementById("hload")
        const pageElem = document.getElementById("pload")
        if (isLoad) {
            if (loadElem !== null) {
                loadElem.style.display = "none"
            }
            if (headerElem !== null) {
                headerElem.style.display = "none"
            }
            if (pageElem !== null) {
                pageElem.style.display = "none"
            }
        }
    }
    useEffect(() => {
        handleLoaded()
    }, [isLoad])
    return (
        <Session_context.Provider value={{ session, setSession }}>
            {
                !isLoad && (
                    <>
                        <LoadSession
                            setIsLoad={setIsLoad} />
                    </>
                )
            }
            {
                appElem !== null && isLoad && (
                    ReactDOM.createPortal(<Form session={session} />, appElem)
                )
            }
            {
                pageElem !== null && isLoad && (
                    ReactDOM.createPortal(
                        <PageControl
                            id={pageElem.getAttribute("pageid")!}
                            session={session} />, pageElem)
                )
            }
            {
                !portalonly && isLoad && (
                    session?.accessJwt !== null ? (
                        <>
                            <ProcButton handler={handleClick}
                                isProcessing={false}
                                showAnimation={false}
                                context="投稿する"
                                className={buttonstyle} />
                            <LogoutButton className={buttonstyle} reload={true} />
                        </>
                    ) : (
                        <ProcButton handler={handleClick}
                            isProcessing={false}
                            showAnimation={false}
                            context="ログイン"
                            className={buttonstyle} />
                    )
                )
            }
        </Session_context.Provider>
    )
}
export default Component