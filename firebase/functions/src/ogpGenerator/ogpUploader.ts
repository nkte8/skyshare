import adminApp from "../credential";
import { getDownloadURL } from 'firebase-admin/storage';
import { envParam } from "../vars"

/**
 * Firebaes storageへファイルの登録
 * @param {Object} props
 * @param {"dev" | "prod"} props.env dev or prod
 * @param {string} props.ogpFilename OGPのファイル名
 * @param {Buffer} props.ogpBuffer 保存するOGPの画像データ
 */
export const uploadOgp = async ({
    env, ogpFilename, ogpBuffer
}: {
    env: "dev" | "prod",
    ogpFilename: string,
    ogpBuffer: Buffer,
}): Promise<string> => {
    try {
        const path = envParam[env] + "/" + ogpFilename
        const bucket = adminApp.bucket()
        const file = bucket.file(path)
        await file.save(
            ogpBuffer,
            {
                metadata: { contentType: 'image/jpeg' }
            },
        )
        return getDownloadURL(file)
    } catch (error) {
        return new Promise(() => { return error })
    }
}

