// localstorage関連  
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
