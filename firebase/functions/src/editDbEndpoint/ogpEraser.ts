import adminApp from "../credential";
import { envParam, envName } from "../vars"

/**
 * Firebaes storageからファイルを削除
 *
 * @param {Object} props
 * @param {"dev" | "prod"} props.env dev or prod
 * @param {string} props.ogpFilename OGPのファイル名
 */
const deleteOgp = async ({
    env,
    ogpFilename
}: {
    env: envName,
    ogpFilename: string,
}): Promise<void> => {
    const path = envParam[env] + "/" + ogpFilename
    const bucket = adminApp.bucket();
    const file = bucket.file(path)
    await file.delete();
}
export default deleteOgp
