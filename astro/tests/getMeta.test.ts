import { describe, test, expect } from "@jest/globals";
import { servicename, servicedesc } from "../src/utils/vars"
import getMeta from "../src/utils/getMeta"

// getMetaについては、必ず [title, description]の順に棄却しなければならない
describe('detectFacets Test', () => {
    test('True Website test', async () => {
        let html = await fetch("https://skyshare.uk").then((text) => text.text())
        const result = getMeta({
            content: html
        })
        expect(result).toEqual(
            [
                `${servicename} - Share Bluesky to X`,
                servicedesc
            ]
        )
    }, 100000) // long timeouf)
    // faketest os:title or og:description only
    test('Fake os:title or og:description only page test', async () => {
        const result = getMeta({
            content: '<html>\
            <head>\
            <meta property="og:title" content="hoge">\
            <meta property="og:description" content="fuga">\
            </head></html>'
        })
        expect(result).toEqual(
            [
                "hoge",
                "fuga"
            ]
        )
    })
    // faketest og:title only
    test('Fake og:title only page test', async () => {
        const result = getMeta({
            content: '<html>\
            <head>\
            <meta property="og:title" content="hoge">\
            </head></html>'
        })
        expect(result).toEqual(
            [
                "hoge",
                ""
            ]
        )
    })
    // faketest og:description only
    test('Fake og:description only page test', async () => {
        const result = getMeta({
            content: '<html>\
            <head>\
            <meta property="og:description" content="fuga">\
            </head></html>'
        })
        expect(result).toEqual(
            [
                "",
                "fuga"
            ]
        )
    })
    // faketest twitter:title and og:description
    test('Fake twitter:title og:description page test', async () => {
        const result = getMeta({
            content: '<html>\
            <head>\
            <meta property="og:description" content="fuga">\
            <meta name="twitter:title" content="hoge">\
            </head></html>'
        })
        expect(result).toEqual(
            [
                "hoge",
                "fuga"
            ]
        )
    })
    // faketest twitter:description and og:title
    test('Fake twitter:description og:title page test', async () => {
        const result = getMeta({
            content: '<html>\
            <head>\
            <meta name="twitter:description" content="fuga">\
            <meta property="og:title" content="hoge">\
            </head></html>'
        })
        expect(result).toEqual(
            [
                "hoge",
                "fuga"
            ]
        )
    })

})
