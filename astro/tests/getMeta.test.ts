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
            {
                title: `${servicename} - Share Bluesky to X`,
                description: servicedesc
            }
        )
    }, 100000) // long timeouf)
    // CORS ERROR
    // test('True Website youtube test', async () => {
    //     let html = await fetch("https://www.youtube.com/watch?v=xitQ_oNTVvE").then((text) => text.text())
    //     const result = getMeta({
    //         content: html
    //     })
    //     expect(result).toEqual(
    //         {
    //             title: "Google Chrome スピードテスト",
    //             description: "20秒でできる？Google Chromeブラウザでお出かけ前の情報チェック。google.co.jp/chrome"
    //         }
    //     )
    // }, 100000) // long timeouf)

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
            {
                title: "hoge",
                description: "fuga"
            }
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
            {
                title: "hoge",
                description: ""
            }
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
            {
                title: "",
                description: "fuga"
            }
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
            {
                title: "hoge",
                description: "fuga"
            }
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
            {
                title: "hoge",
                description: "fuga"
            }
        )
    })

})