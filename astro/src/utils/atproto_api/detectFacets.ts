import resolveHandle from "./resolveHandle"
// atproto.detectFacets
// 本家はinputは RichText型であるが、text型でなんとかする

type regexResult = {
    encoded: string,
    index: {
        byteStart: number,
        byteEnd: number,
    }
}
const regexSeacrh = ({
    array,
    regex,
    encoded,
    cursor = 0
}: {
    array: Array<regexResult>,
    regex: RegExp
    encoded: string,
    cursor?: number
}) => {
    // 文字を取得するために使用
    const regexedText = regex.exec(encoded)
    // バイト数を数えるために使用
    const replacedText = regex.exec(encoded.replace(/%../g, "*"))
    if (regexedText === null || replacedText === null) {
        return
    }
    const regexedStart = replacedText.index
    const linkref = decodeURI(regexedText[1])
    const regexedEnd = regexedStart + replacedText[1].length
    const sliceEnd = regexedText.index + regexedText[1].length
    const Item = {
        encoded: linkref,
        index: {
            byteStart: cursor + regexedStart,
            byteEnd: cursor + regexedEnd
        }
    }
    array.push(Item)
    regexSeacrh({
        array,
        regex,
        encoded: encoded.slice(sliceEnd),
        cursor: cursor + regexedEnd,
    })
}

const createLinkFacet = ({
    encoded,
}: {
    encoded: string,
}): Array<facet.link> => {
    const Regex = /(https?:\/\/[^ ]*) ?/i
    let facet: Array<facet.link> = []
    let regexResult: Array<regexResult> = []
    regexSeacrh({
        array: regexResult,
        regex: Regex,
        encoded: encoded,
    })
    for (let link of regexResult) {
        facet.push({
            index: link.index,
            features: [
                {
                    $type: "app.bsky.richtext.facet#link",
                    uri: link.encoded
                }
            ]
        })
    }
    return facet
}

const createMentionFacet = async ({
    encoded,
}: {
    encoded: string,
}): Promise<Array<facet.mention>> => {
    const Regex = /(@[^ ]*) ?/i
    let result: Array<facet.mention> = []
    let regexResult: Array<regexResult> = []
    regexSeacrh({
        array: regexResult,
        regex: Regex,
        encoded: encoded,
    })
    for (let link of regexResult) {
        const resResolve = await resolveHandle({ handle: link.encoded.slice(1) })
        // 存在しないハンドルの場合はfacetから除外
        if (typeof resResolve?.error !== "undefined") {
            continue
        }
        result.push({
            index: link.index,
            features: [
                {
                    $type: "app.bsky.richtext.facet#mention",
                    did: resResolve.did
                }
            ]
        })
    }
    return result
}

const detectFacets = async ({
    text
}: {
    text: string
}): Promise<Array<facet.link | facet.mention>> => {
    let facets: Array<
        facet.link | facet.mention
    > = []
    const encoded = encodeURI(text).replace(/%(20|0A)/g, " ")
    facets = facets.concat(createLinkFacet({ encoded }))
    facets = facets.concat(await createMentionFacet({ encoded }))
    return facets
}

// 機能してそうなfacetの定義型
namespace facet {
    export type link = {
        index: {
            byteStart: number,
            byteEnd: number,
        }
        features: [
            {
                $type: "app.bsky.richtext.facet#link",
                uri: string
            }
        ]
    }
    export type mention = {
        index: {
            byteStart: number,
            byteEnd: number,
        }
        features: [
            {
                $type: "app.bsky.richtext.facet#mention",
                did: string
            }
        ]
    }
}

export default detectFacets