import resolveHandle from "./resolveHandle"
// atproto.detectFacets
// 本家はinputは RichText型であるが、text型でなんとかする

type regexResult = {
    text: string,
    index: {
        byteStart: number,
        byteEnd: number,
    }
}
const regexSeacrh = ({
    array,
    regex,
    text,
    cursor = 0
}: {
    array: Array<regexResult>,
    regex: RegExp
    text: string,
    cursor?: number
}) => {
    const regexedlink = regex.exec(text)
    if (regexedlink === null) {
        cursor = -1
        return
    }
    const regexedStart = regexedlink.index
    const linkref = regexedlink[1]
    const regexedEnd = regexedStart + linkref.length
    array.push({
        text: linkref,
        index: {
            byteStart: cursor + regexedStart,
            byteEnd: cursor + regexedEnd
        }
    })
    regexSeacrh({
        array,
        regex,
        text: text.slice(regexedEnd),
        cursor: cursor + regexedEnd
    })
}

const createLinkFacet = ({
    text,
}: {
    text: string,
}): Array<facet.link> => {
    const Regex = /(https?:\/\/[^ ]*) ?/i
    let facet: Array<facet.link> = []
    let regexResult: Array<regexResult> = []
    regexSeacrh({
        array: regexResult,
        regex: Regex,
        text: text,
    })
    for (let link of regexResult) {
        facet.push({
            index: link.index,
            features: [
                {
                    $type: "app.bsky.richtext.facet#link",
                    uri: link.text
                }
            ]
        })
    }
    return facet
}

const createMentionFacet = async ({
    text,
}: {
    text: string,
}): Promise<Array<facet.mention>> => {
    const Regex = /(@[^ ]*) ?/i
    let result: Array<facet.mention> = []
    let regexResult: Array<regexResult> = []
    regexSeacrh({
        array: regexResult,
        regex: Regex,
        text: text,
    })
    for (let link of regexResult) {
        const resResolve = await resolveHandle({ handle: link.text.slice(1) })
        // 存在しないハンドルの場合はfacetから除外
        if (typeof resResolve?.error !== "undefined") {
            continue
        }
        result.push({
            $type: "app.bsky.richtext.facet",
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

    facets = facets.concat(createLinkFacet({ text }))
    facets = facets.concat(await createMentionFacet({ text }))

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
        $type: "app.bsky.richtext.facet"
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