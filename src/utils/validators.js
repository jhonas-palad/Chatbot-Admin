
const REGEX_EMPTY = /^\s*$/;


export function isEmptyString(str){
    return !str || REGEX_EMPTY.test(str)
}

export function isAllAlphaNumeric(str, whitespaces=true){
    const re_alphanumeric = whitespaces ? /^.[ a-zA-Z0-9_]*$/ : /^.[a-zA-Z0-9_]*$/;
    const cleanedStr = str.trim();
    return !isEmptyString(cleanedStr) && re_alphanumeric.test(cleanedStr);
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
