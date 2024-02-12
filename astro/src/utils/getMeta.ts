export type ogpMeta = {
    title: string,
    description: string
}
const getMeta = ({
    content
}: {
    content: string
}): ogpMeta => {
    let metas: Array<string> = []

    const titleFilter: Array<RegExp> = [
        /(?<= *< *meta +name=["']?twitter:title["']? +content=)["']?([^"']*)["']?/,
        /(?<= *< *meta +property=["']?og:title["']? +content=)["']?([^"']*)["']?/,
    ]
    const descriptionFilter: Array<RegExp> = [
        /(?<= *< *meta +name=["']?twitter:description["']? +content=)["']?([^"']*)["']?/,
        /(?<= *< *meta +property=["']?og:description["']? +content=)["']?([^"']*)["']?/,
    ]
    for (let filters of [titleFilter, descriptionFilter]) {
        let result: string = ""
        for (let filter of filters) {
            const regResult = filter.exec(content)
            if (regResult !== null) {
                result = regResult[1]
                break
            }
        }
        metas.push(result)
    }
    return {
        title: metas[0],
        description: metas[1],
    }
}
export default getMeta
