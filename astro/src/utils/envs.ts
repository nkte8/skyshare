// 正しくbool値を処理。 `True` 以外は全て False として処理
const stringToBoolean = (value: string | null | undefined): boolean => {
    if (!value) {
        return false;
    }
    return value.toLowerCase() === 'true';
}
export const baseurl = import.meta.env.BASE_URL
export const isNotProduction = stringToBoolean(import.meta.env.PUBLIC_IS_NOT_PRODUCTION)
export const corsAllowOrigin = (isNotProduction) ? "*" : import.meta.env.SITE
export const posturl = baseurl + "app/"
export const abouturl = baseurl + "about/"
export const qaurl = baseurl + "qa/"
export const changeurl = baseurl + "changelog/"
export const policyurl = baseurl + "privacypolicy/"
export const featureurl = baseurl + "feature/"
