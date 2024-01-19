// localstorage関連  
interface LocalStorageInfo {
    refreshJwt: string;
}

const Id_accessJwt = "accessJwt"
const Id_refreshJwt = "refreshJwt"

export const read_Jwt = (): LocalStorageInfo | null => {
    const rjwt = get_ls_value(Id_refreshJwt)
    if (rjwt !== null) {
        return {
            refreshJwt: rjwt
        }
    }
    rm_ls_value(Id_accessJwt)
    rm_ls_value(Id_refreshJwt)
    return null
}

export const write_Jwt = ({
    refreshJwt
}: LocalStorageInfo): boolean => {
    const rjwt = set_ls_value(Id_refreshJwt, refreshJwt)
    if (rjwt === true) {
        return true
    }
    return false
}

export const reset_Jwt = (): void => {
    rm_ls_value(Id_refreshJwt)
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
