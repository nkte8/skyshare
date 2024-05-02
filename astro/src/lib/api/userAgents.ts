const twitterHostnames = ["twitter.com", "x.com"]

export const getUserAgent = (headers: Headers, url: string): string => {
    const userAgent: string | null = headers.get("User-Agent")
    if (userAgent === null || isTwitterUrl(new URL(url))) {
        return "bot"
    }
    return userAgent
}

export const isTwitterUrl = (url: URL): boolean => {
    return twitterHostnames.includes(url.hostname)
}
