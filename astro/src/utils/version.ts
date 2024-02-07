// package.jsonから自動でバージョンを取得
// SSRモードのページでは動かない
import fs from 'node:fs/promises';
const url = new URL('../../package.json', import.meta.url);
const json = await fs.readFile(url, 'utf-8');
const data = JSON.parse(json);
export const version = `v${data.version}`
export default version