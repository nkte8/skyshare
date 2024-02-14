// jsdomはNode用だったのでフロントでできない。
// フロントでやりたいのでローレベルで書く
const getOgp = ({
    content
}: {
    content: string
}): string => {
    let ogpUrl: string = ""
    const regexFilters: Array<RegExp> = [
        /(?: *< *meta +name=["']?twitter:image["']? +content=)["']?([^"']*)["']?/,
        /(?: *< *meta +property=["']?og:image["']? +content=)["']?([^"']*)["']?/
    ]
    // &->&amp;(or &#38)にエスケープされている場合、これを置き換え処理
    // (fetchの取得結果をただすなど)もっと根本的に修正できるのであればそうすべき。
    for (let filter of regexFilters) {
        const regResult = filter.exec(content)
        if (regResult !== null) {
            ogpUrl = regResult[1].replace("&#38;", "&")
            break
        }
    }
    return ogpUrl
}
export default getOgp
