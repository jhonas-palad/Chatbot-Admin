const REGEX_ALPHANUMERIC = /^.[a-zA-Z0-9]*$/;
const REGEX_EMPTY = /^\s*$/;



export const isEmptyString = (str) => {
    return !str || REGEX_EMPTY.test(str)
}

export const isAllAlphaNumeric = (str) => {
    const cleanedStr = str.trim();
    return !isEmptyString(cleanedStr) && REGEX_ALPHANUMERIC.test(cleanedStr);
}