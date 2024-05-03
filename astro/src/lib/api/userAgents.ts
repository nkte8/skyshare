const twitterHostnames = ["twitter.com", "x.com"]

/**
 * URLに対応するUserAgentを取得します
 * @param headers ヘッダー
 * @param url URL
 * @returns URLに対応するUserAgent
 */
export const getUserAgent = (headers: Headers, url: string): string => {
    const userAgent: string | null = headers.get("User-Agent")
    if (userAgent === null || isTwitterUrl(new URL(url))) {
        return "bot"
    }
    return userAgent
}

/**
 * TwitterのURLかどうかを判定します
 * @param url URL
 * @returns TwitterのURLであればtrue
 */
export const isTwitterUrl = (url: URL): boolean => {
    return twitterHostnames.includes(url.hostname)
}
