import { useState, useEffect } from "react"
import ReactDOM from "react-dom";
import { posturl } from "@/utils/envs"
import { Session_context, type Session_info, Profile_context } from "./common/contexts"
import ProcButton from "./common/ProcButton"
import LogoutButton from "./bsky/LogoutButton"
import AppForm from "./AppForm"
import LoadSession from "./bsky/LoadSession"
import PageControllerForm from "./pagedb/PageControllerForm"
import type model_getProfile from "@/utils/atproto_api/models/getProfile.json";

const Component = ({
    portalonly = false
}: {
    portalonly?: boolean
}) => {
    const [isLoaded, setIsLoad] = useState<boolean>(false)
    const [processing, setProcessing] = useState<boolean>(false)
    const [session, setSession] = useState<Session_info>({
        did: null,
        accessJwt: null,
        refreshJwt: null,
        handle: null,
    })
    const [profile, setProfile] = useState<typeof model_getProfile | null>(null)
    const buttonstyle = "font-medium rounded-full focus:outline-none"
    
    const handleClick = () => {
        location.href = posturl
    }
    const appElem = document.getElementById("app")
    const pageElem = document.getElementById("page")
    const handleLoaded = () => {
        const loadElem = document.getElementById("bload")
        const headerElem = document.getElementById("hload")
        const pageElem = document.getElementById("pload")
        if (isLoaded) {
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
    }, [isLoaded])
    return (
        <Session_context.Provider value={{ session, setSession }}>
            <Profile_context.Provider value={{ profile, setProfile }}>
                {
                    !isLoaded && (
                        <>
                            <LoadSession
                                setIsLoad={setIsLoad} />
                        </>
                    )
                }
                {
                    appElem !== null && isLoaded && (
                        ReactDOM.createPortal(
                            <AppForm processing={processing}
                                setProcessing={setProcessing}
                                session={session} />, appElem
                        )
                    )
                }
            </Profile_context.Provider>

            {
                pageElem !== null && isLoaded && (
                    ReactDOM.createPortal(
                        <PageControllerForm
                            id={pageElem.getAttribute("pageid")!}
                            session={session} />, pageElem)
                )
            }
            {
                !portalonly && isLoaded && (
                    session?.accessJwt !== null ? (
                        <>
                            <ProcButton handler={handleClick}
                                isProcessing={processing}
                                disabled={processing}
                                showAnimation={false}
                                context="投稿する"
                                className={buttonstyle} />
                            <LogoutButton
                                className={buttonstyle}
                                reload={true}
                                processing={processing}
                                setProcessing={setIsLoad}
                            />
                        </>
                    ) : (
                        <ProcButton handler={handleClick}
                            isProcessing={processing}
                            disabled={processing}
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