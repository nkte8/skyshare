/**
 * text -> richtextに変換を行うparserコンストラクタ
 *
 */
class richTextFacetParser {
    private regexSeacrh = ({
        regex,
        text,
        cursor = 0,
        result = []
    }: {
        regex: RegExp
        text: string
        cursor?: number,
        result: Array<string>
    }): void => {
        // regexした結果
        const regexResult = regex.exec(text)
        // マッチがない場合はresultを返却
        if (regexResult === null) {
            return
        }
        const matchIndex = regexResult.index
        const matchText = regexResult[1]
        const matchEnd = cursor + matchIndex + matchText.length
        result.push(matchText)
        this.regexSeacrh({
            regex,
            text: text.slice(matchEnd),
            cursor: cursor + matchEnd,
            result
        })
    }
    type: richTextFacetType
    regex: RegExp
    constructor(type: richTextFacetType) {
        this.type = type
        // typeが定まったらregexパターンも定まる
        switch (type) {
            case "link":
                this.regex = /(https?:\/\/[^ \r\n]+)( |\r\n|\n|\r)?/i
                break
            case "tag":
                this.regex = /((#|#️⃣)[^ \r\n]*)( |\r\n|\n|\r)?/i
                break
        }
    }
    getFacet = (text: string) => {
        let result: Array<string> = []
        this.regexSeacrh({
            regex: this.regex,
            text,
            result
        })
        return result
    }
}
type richTextFacetType = "link" | "tag"

type parsedText = {
    type: richTextFacetType,
    content: Array<string>
}
const parseText = async ({
    text
}: {
    text: string
}): Promise<Array<parsedText>> => {
    let result: Array<parsedText> = []
    // link用Parser
    const facetLink = new richTextFacetParser("link")
    const facetTag = new richTextFacetParser("tag")
    // Parse結果をresultに格納
    result = result.concat({
        type: facetLink.type,
        content: facetLink.getFacet(text)
    })
    result = result.concat({
        type: facetTag.type,
        content: facetTag.getFacet(text)
    })
    return result
}

export default parseText
export { type parsedText, richTextFacetParser }