import adminApp from "./credential";
import { getDownloadURL } from 'firebase-admin/storage';

let envParam = {
    dev: "ogpdev",
    prod: "ogp"
};

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

