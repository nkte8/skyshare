import userAgents from "./data/useragents.json"

export const getRandomUserAgent = (): string => {
    return String(
        (userAgents as { list: string[] }).list[
            Math.floor(
                Math.random() * (userAgents as { list: string[] }).list.length,
            )
        ],
    )
}
