import getProfile from "@/utils/atproto_api/getProfile";
import type model_getProfile from "@/utils/atproto_api/models/getProfile.json";
import { Dispatch, SetStateAction } from "react"
export const loadProfile = async ({
    session,
    setProfile
}: {
    session: {
        accessJwt: string,
        handle: string
    },
    setProfile: Dispatch<SetStateAction<typeof model_getProfile | null>>
}) => {
    try {
        setProfile(null)
        if (session.accessJwt === null || session.handle === null) {
            return
        }
        const res = await getProfile({
            accessJwt: session.accessJwt,
            handle: session.handle
        })
        if (res !== null && typeof res?.error === "undefined") {
            const res_prof: typeof model_getProfile = res as typeof model_getProfile
            setProfile(res_prof)
        }
    } catch (error) {
        // プロフィール画像をよみこむだけなのでステータスを省略している
    }
}
export default loadProfile