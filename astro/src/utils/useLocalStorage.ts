// localstorage関連  
import { Base64 } from "js-base64"
type Obj = {
    [key: string]: string;
};
const LSKeyName: Obj = {
    accessJwt: "accessJwt",
    refreshJwt: "refreshJwt",
    autoXPopup: "autoXPopup",
    noGenerate: "noGenerate",
    showTaittsuu: "showTaittsuu",
    forceIntent: "forceIntent",
    savePassword: "savePassword",
    loginInfo: "loginInfo",
    savedTags: "savedTags",
    appendVia: "appendVia"
}
type loginInfo = {
    id: string,
    pw: string
}

// viaはlexicon的には定義されていない?付与しての投稿自体は問題ないため、オプションに変更
export const readAppendVia = (def: boolean): boolean => {
    const value = get_ls_value(LSKeyName.appendVia)
    if (value !== null) {
        return value === "true"
    }
    rm_ls_value(LSKeyName.appendVia)
    return def
}

export const setAppendVia = (flag: boolean): void => {
    set_ls_value(LSKeyName.appendVia, flag.toString())
    if (flag === false) {
        rm_ls_value(LSKeyName.appendVia)
    }
}

// 将来的にはローカルではなく、DB側に保存したい
// DB構造を変えることになると思われるため,大きなアップデートの時の次タスクとして積みたい
export const readSavedTags = (): string[] | null => {
    const value = get_ls_value(LSKeyName.savedTags)
    if (value !== null) {
        const Logininfo: string[] =
            JSON.parse(Base64.decode(value))
        return Logininfo
    }
    rm_ls_value(LSKeyName.savedTags)
    return null
}

export const setSavedTags = (Tags: string[]): void => {
    const savedTags: string =
        Base64.encode(JSON.stringify(Tags)
        )
    set_ls_value(LSKeyName.savedTags, savedTags)
}

export const resetLoginInfo = () => {
    rm_ls_value(LSKeyName.loginInfo)
}

export const readLogininfo = (): loginInfo | null => {
    const value = get_ls_value(LSKeyName.loginInfo)
    if (value !== null) {
        const Logininfo: loginInfo =
            JSON.parse(Base64.decode(value))
        return Logininfo
    }
    rm_ls_value(LSKeyName.loginInfo)
    return null
}

export const setLogininfo = ({ id, pw }: loginInfo): void => {
    const Logininfo: string =
        Base64.encode(JSON.stringify({
            id: id, pw: pw
        })
        )
    set_ls_value(LSKeyName.loginInfo, Logininfo)
}

export const readSavePassword = (def: boolean): boolean => {
    const value = get_ls_value(LSKeyName.savePassword)
    if (value !== null) {
        return value === "true"
    }
    rm_ls_value(LSKeyName.savePassword)
    return def
}

export const setSavePassword = (flag: boolean): void => {
    set_ls_value(LSKeyName.savePassword, flag.toString())
    if (flag === false) {
        rm_ls_value(LSKeyName.loginInfo)
    }
}

export const readForceIntent = (def: boolean): boolean => {
    const value = get_ls_value(LSKeyName.forceIntent)
    if (value !== null) {
        return value === "true"
    }
    rm_ls_value(LSKeyName.forceIntent)
    return def
}

export const setForceIntent = (flag: boolean): void => {
    set_ls_value(LSKeyName.forceIntent, flag.toString())
}

export const readShowTaittsuu = (def: boolean): boolean => {
    const value = get_ls_value(LSKeyName.showTaittsuu)
    if (value !== null) {
        return value === "true"
    }
    rm_ls_value(LSKeyName.showTaittsuu)
    return def
}

export const setShowTaittsuu = (flag: boolean): void => {
    set_ls_value(LSKeyName.showTaittsuu, flag.toString())
}

export const readNoGenerate = (def: boolean): boolean => {
    const value = get_ls_value(LSKeyName.noGenerate)
    if (value !== null) {
        return value === "true"
    }
    rm_ls_value(LSKeyName.noGenerate)
    return def
}

export const setNoGenerate = (flag: boolean): void => {
    set_ls_value(LSKeyName.noGenerate, flag.toString())
}

export const readAutoXPopup = (def: boolean): boolean => {
    const value = get_ls_value(LSKeyName.autoXPopup)
    if (value !== null) {
        return value === "true"
    }
    rm_ls_value(LSKeyName.autoXPopup)
    return def
}

export const setAutoXPopup = (flag: boolean): void => {
    set_ls_value(LSKeyName.autoXPopup, flag.toString())
}

export const readJwt = (): string | null => {
    const rjwt = get_ls_value(LSKeyName.refreshJwt)
    if (rjwt !== null) {
        return rjwt
    }
    rm_ls_value(LSKeyName.accessJwt)
    rm_ls_value(LSKeyName.refreshJwt)
    return null
}

export const writeJwt = (refreshJwt: string): boolean => {
    const rjwt = set_ls_value(LSKeyName.refreshJwt, refreshJwt)
    if (rjwt === true) {
        return true
    }
    return false
}

export const resetJwt = (): void => {
    rm_ls_value(LSKeyName.refreshJwt)
}

export const resetAll = (): void => {
    for (const key in LSKeyName) {
        rm_ls_value(key)
    }
}

const get_ls_value = (key: string): string | null => {
    let rval: string | null = null
    if (typeof localStorage !== "undefined") {
        let value = localStorage.getItem(key);
        rval = value !== null ? value : null
    }
    return rval
}

const set_ls_value = (key: string, value: string): boolean => {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
        return true
    }
    return false
}

const rm_ls_value = (key: string): boolean => {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
        return true
    }
    return false
}
