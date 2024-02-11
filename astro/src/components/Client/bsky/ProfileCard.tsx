import { useContext } from "react"
import { Profile_context } from "../common/contexts"
import { link } from "../common/tailwind_variants";

export const Component = () => {
    const { profile } = useContext(Profile_context)

    return (
        <>
            <img src={profile?.avatar} className="w-10 h-10 mr-2 inline-block rounded-full" />
            <span className="mx-1 text-wrap align-middle">{profile?.displayName}
                {typeof profile?.handle !== "undefined" ? (
                    <a href={new URL(profile?.handle, "https://bsky.app/profile/").toString()}
                        className={link({ class: "m-1" })}>
                        @{profile?.handle}
                    </a>
                ) : (
                    <></>
                )
                }
            </span>
        </>
    )
}

export default Component