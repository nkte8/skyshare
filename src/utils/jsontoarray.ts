import { readFileSync } from 'fs';
export type Data = {
    slug: string,
    img: imgData,
}
export type imgData = {
    path: string,
}
export const JtoArray = async (Jpath:string) => {
    const jsonString: string = readFileSync(Jpath, 'utf-8');
    const jsonData = JSON.parse(jsonString) as Data[];
    return jsonData
}