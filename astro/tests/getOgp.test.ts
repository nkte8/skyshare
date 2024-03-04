import { describe, test, expect } from "@jest/globals";
import { getOgpMeta } from "../src/utils/getOgp"
import type { ogpMataData, errorResponse } from "../src/lib/types";

const version = `v${process.env.PUBLIC_VERSION}`
const siteurl = "http://192.168.3.200:4321"

describe('getOgp Test', () => {
    test('True Website test', async () => {
        let result: ogpMataData | errorResponse = await getOgpMeta(siteurl, "https://skyshare.uk")
        expect(result).toEqual(
            <ogpMataData>{
                type: "meta",
                title: "Skyshare - Share Bluesky to X",
                description: "Skyshare is a web application helps bluesky users post to both bluesky or x.com.",
                image: `https://skyshare.uk/materials/ogp_main.png?updated=${version}`
            }
        )
    }, 10000) // long timeouf)
    // YoutubeはCORSが設定されている例
    test('True Website cors site test', async () => {
        let result: ogpMataData | errorResponse = await getOgpMeta(siteurl, "https://www.youtube.com/watch?v=xitQ_oNTVvE")
        expect(result).toEqual(
            <ogpMataData>{
                type: "meta",
                title: "Google Chrome スピードテスト",
                description: "20秒でできる？Google Chromeブラウザでお出かけ前の情報チェック。google.co.jp/chrome",
                image: `https://i.ytimg.com/vi/xitQ_oNTVvE/hqdefault.jpg`
            }
        )
    }, 100000) // long timeouf)
    // Zennは　twitter:imageが設定されていない例
    test('True Website no twitter:image test', async () => {
        let result: ogpMataData | errorResponse = await getOgpMeta(siteurl, "https://zenn.dev")
        expect(result).toEqual(
            <ogpMataData>{
                type: "meta",
                title: "Zenn｜エンジニアのための情報共有コミュニティ",
                description: "Zennはエンジニアが技術・開発についての知見をシェアする場所です。本の販売や、読者からのバッジの受付により対価を受け取ることができます。",
                image: `https://static.zenn.studio/images/logo-only-dark.png`
            }
        )
    }, 100000) // long timeouf)
    // It media はエンコーディングが古い shift-jisのサイト
    test('True Website shift-jis site test', async () => {
        let result: ogpMataData | errorResponse = await getOgpMeta(siteurl, "https://www.itmedia.co.jp/news/")
        expect(result).toEqual(
            <ogpMataData>{
                type: "meta",
                title: "ITmedia NEWS",
                description: "ITがもたらす変化を敏感に感じ取り、仕事や生活に生かしていこうという企業内個人やネットサービス開発者、ベンチャー経営者をコアターゲットに、IT業界動向やネットサービストレンド、ネット上の話題までカバーするニュースを配信します。",
                image: `https://image.itmedia.co.jp/images/logo/1200x630_500x500_news.gif`
            }
        )
    }, 100000) // long timeouf)

})
