import { describe, test, expect } from "@jest/globals";
import getOgp from "../src/utils/getOgp"
const version = `v${process.env.PUBLIC_VERSION}`

describe('detectFacets Test', () => {
    test('True Website test', async () => {
        let html = await fetch("https://skyshare.uk").then((text) => text.text())
        const result = getOgp({
            content: html
        })
        expect(result).toEqual(
            `https://skyshare.uk/materials/ogp_main.png?updated=${version}`
        )
    }, 100000) // long timeouf)
    // faketest og:image only
    test('Fake og:image only page test', async () => {
        const result = getOgp({
            content: '<html>\
            <head>\
            <meta property="og:image" content="https://hoge/hoge.jpg">\
            </head>\
            </html>'
        })
        expect(result).toEqual(
            `https://hoge/hoge.jpg`
        )
    })
    // faketest twitter:image only
    test('Fake twitter:image only page test', async () => {
        const result = getOgp({
            content: '<html>\
            <head>\
            <meta name="twitter:image" content="https://hoge/fuga.jpg">\
            </head>\
            </html>'
        })
        expect(result).toEqual(
            `https://hoge/fuga.jpg`
        )
    })
    // faketest no ogp
    test('Fake no ogp page test', async () => {
        const result = getOgp({
            content: '<html><head></head></html>'
        })
        expect(result).toEqual(
            ""
        )
    })
    // faketest both ogp select twitter:image
    test('Fake both ogp select twitter:image test', async () => {
        const result = getOgp({
            content: '<html>\
            <head>\
            <meta property="og:image" content="https://hoge/hoge.jpg">\
            <meta name="twitter:image" content="https://hoge/fuga.jpg">\
            </head>\
            </html>'
        })
        expect(result).toEqual(
            `https://hoge/fuga.jpg`
        )
    })
    // faketest very bad but not wrong test
    test('Fake very bad but not wrong test', async () => {
        const result = getOgp({
            content: `<html>\
            <head>    <  meta  property=og:image  content='https://hoge/hoge.jpg'  />\
            </head></html>`
        })
        expect(result).toEqual(
            `https://hoge/hoge.jpg`
        )
    })
    // faketest reallikeURL get test
    test('Fake reallike url get test', async () => {
        const result = getOgp({
            content: `<html>\
            <head>\
            <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/ogp-generator-5f516.appspot.com/o/ogpdev%2Fnlla.bsky.social%2F3kl5ka3i2bt27?alt=media&token=5fe67771-922e-44ec-a3d4-cd94d6fe5885">\
            </head></html>`
        })
        expect(result).toEqual(
            `https://firebasestorage.googleapis.com/v0/b/ogp-generator-5f516.appspot.com/o/ogpdev%2Fnlla.bsky.social%2F3kl5ka3i2bt27?alt=media&token=5fe67771-922e-44ec-a3d4-cd94d6fe5885`
        )
    })

})
