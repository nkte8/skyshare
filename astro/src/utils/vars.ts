export const baseurl = import.meta.env.BASE_URL
export const siteurl = import.meta.env.SITE
export const githuburl = "https://github.com/nkte8/skyshare"
export const zennprofile = "https://zenn.dev/nkte8"
export const zennurl = "https://zenn.dev/nkte8/articles/2024-02-03-r01"
export const posturl = baseurl + "app/"
export const abouturl = baseurl + "about/"
export const qaurl = baseurl + "qa/"
export const pagesPrefix = "posts"
export const servicename = "Skyshare"

import fs from 'node:fs/promises';
const url = new URL('../../package.json', import.meta.url);
const json = await fs.readFile(url, 'utf-8');
const data = JSON.parse(json);
export const version = `v${data.version}`
