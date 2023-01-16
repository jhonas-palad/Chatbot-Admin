const REGEX_ALPHANUMERIC = /^.[a-zA-Z0-9]*$/;
const REGEX_EMPTY = /^\s*$/;


export function isEmptyString(str){
    return !str || REGEX_EMPTY.test(str)
}

export function isAllAlphaNumeric(str){
    const cleanedStr = str.trim();
    return !isEmptyString(cleanedStr) && REGEX_ALPHANUMERIC.test(cleanedStr);
}

export function isFloat(value){
    if (
        typeof value === 'number' &&
        !Number.isNaN(value) &&
        !Number.isInteger(value)
    ) {
        return true;
    }
    return false;
}
