function getCharacters(from: string, to: string): string[] {
    const fromCode = from.charCodeAt(0);
    const toCode = to.charCodeAt(0);
    const result: string[] = [];
    for (let i = fromCode; i <= toCode; i++) {
        result.push(String.fromCharCode(i));
    }
    return result;
}

/** Determines if a string begins with a substring */
function stringBeginsWith(str: string, substr: string, options = { caseSensitive: true }): boolean {
    if (substr.length > str.length) {
        return false;
    }

    if (!substr || substr.length === 0) {
        return true;
    }

    if (!options.caseSensitive) {
        str = str.toLowerCase();
        substr = substr.toLowerCase();
    }

    str = str.substr(0, substr.length);
    return str === substr;
}

/** Determines whether an array contains any of a list of values */
function arrayIncludesAny<T>(array: T[], ...values: T[]): boolean {
    for (const val of values) {
        if (array.indexOf(val) > -1) {
            return true;
        }
    }

    return false;
}

function concat(...args) {
    return args.reduce((concatenated: [any], current: [any]) => {
        return concatenated.concat(current);
    }, []);
}

export default {
    getCharacters,
    stringBeginsWith,
    arrayIncludesAny,
    concat,
};

export { getCharacters, stringBeginsWith, arrayIncludesAny, concat };
