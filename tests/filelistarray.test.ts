import { describe } from "node:test";
import { findExt } from "../src/utils/filelistarray";

describe('find images from images', () => {
    test('ext: png', async () => {
        const files = await findExt("tests/images/", ["png"])
        expect(files).toEqual(
            expect.arrayContaining([
                "tests/images/1.png",
                "tests/images/2.PNG"
            ])
        )
    })
    test('ext: png and jpeg', async () => {
        const files = await findExt("tests/images/", ["png","jpg"])
        expect(files).toEqual(
            expect.arrayContaining([
                "tests/images/1.png",
                "tests/images/2.PNG",
                "tests/images/1.jpg",
                "tests/images/2.Jpg",
            ])
        )
    })
})