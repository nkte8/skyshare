import { glob } from 'glob'

// 再帰関数のエンドポイント
export const findExt = async (path: string, extfilters: Array<string>): Promise<Array<string>> => {
    const globfilter = `${path}*.+(${extfilters.join("|")})`
    const paths = await glob(globfilter,{nodir:true, nocase:true})
    
    return paths
}
