import React, {
    createContext
} from "react"
import type getProfile from "@/utils/atproto_api/models/getProfile.json";

export type Session_info = {
    did: string | null,
    accessJwt: string | null,
    refreshJwt: string | null,
    handle: string | null,
}
export const Session_context = createContext({} as {
    session: Session_info
    setSession: React.Dispatch<React.SetStateAction<Session_info>>
})

export const Profile_context = createContext({} as {
    profile: typeof getProfile | null
    setProfile: React.Dispatch<React.SetStateAction<typeof getProfile | null>>
})
