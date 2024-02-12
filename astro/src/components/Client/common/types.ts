export type modes = "bsky" | "pagedb" | "xcom"

export type msgInfo = {
    msg: string,
    isError: boolean,
}

export type xContent = {
    url: URL | null,
    content: string,
}
