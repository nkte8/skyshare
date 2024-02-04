import { describe } from "node:test";
import detectFacets from "../src/utils/atproto_api/detectFacets"

describe('detectFacets Test', () => {
    test('hello world', async () => {
        const result = await detectFacets({
            text: "hello world!"
        })
        expect(result).toEqual([])
    })
    test('Link facets', async () => {
        const result = await detectFacets({
            text: "this is https://link1 https://link2"
        })
        expect(result).toEqual(
            expect.arrayContaining([
                {
                    index: {
                        byteStart: 8,
                        byteEnd: 21
                    },
                    features: [
                        {
                            $type: "app.bsky.richtext.facet#link",
                            uri: "https://link1"
                        }
                    ]
                },
                {
                    index: {
                        byteStart: 22,
                        byteEnd: 35
                    },
                    features: [
                        {
                            $type: "app.bsky.richtext.facet#link",
                            uri: "https://link2"
                        }
                    ]
                },
            ])
        )
    })

    test('mentions facets', async () => {
        const result = await detectFacets({
            text: "iam @nlla.bsky.social at @bsky.app"
        })
        expect(result).toEqual(
            expect.arrayContaining([
                {
                    $type: "app.bsky.richtext.facet",
                    index: {
                        byteStart: 4,
                        byteEnd: 21
                    },
                    features: [
                        {
                            $type: "app.bsky.richtext.facet#mention",
                            did: "did:plc:arvsmkkcflx2hdfum5jk54n3"
                        }
                    ]
                },
                {
                    $type: "app.bsky.richtext.facet",
                    index: {
                        byteStart: 25,
                        byteEnd: 34
                    },
                    features: [
                        {
                            $type: "app.bsky.richtext.facet#mention",
                            did: "did:plc:z72i7hdynmk6r22z27h6tvur"
                        }
                    ]
                },
            ])
        )
    },100000) // long timeouf


    test('mention and link facets', async () => {
        const result = await detectFacets({
            text: "Thanx @bsky.app https://bsky.app/ !"
        })
        expect(result).toEqual(
            expect.arrayContaining([
                {
                    $type: "app.bsky.richtext.facet",
                    index: {
                        byteStart: 6,
                        byteEnd: 15
                    },
                    features: [
                        {
                            $type: "app.bsky.richtext.facet#mention",
                            did: "did:plc:z72i7hdynmk6r22z27h6tvur"
                        }
                    ]
                },
                {
                    index: {
                        byteStart: 16,
                        byteEnd: 33
                    },
                    features: [
                        {
                            $type: "app.bsky.richtext.facet#link",
                            uri: "https://bsky.app/"
                        }
                    ]
                },
            ])
        )
    },100000) // long timeouf

})
