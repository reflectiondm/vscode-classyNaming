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
    if (substr.length > str.length || str.length === 0) {
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
function arrayContainsAny<T>(array: T[], ...values: T[]): boolean {
    if (!array || !array.length) {
        return false;
    }
    if (!values || !values.length) {
        return true;
    }

    for (const val of values) {
        if (array.indexOf(val) > -1) {
            return true;
        }
    }

    return false;
}

function toCase(toType: 'pascal' | 'camel' | '_camel', str: string): string {
    if (str === "_" && toType === "_camel") {
        return "_";
    } else if (str === "_" && toType !== "_camel") {
        return "";
    }

    if (str[0] === "_") {
        str = str.substr(1);
    }

    if (toType === "camel") {
        str = str[0].toLowerCase() + str.substr(1);
    }
    if (toType === "_camel") {
        str = "_" + str[0].toLowerCase() + str.substr(1);
    }
    if (toType === "pascal") {
        str = str[0].toUpperCase() + str.substr(1);
    }

    return str;
}

function getCase(str: string): 'pascal' | 'camel' | '_camel' | null {
    if (!str) {
        return null;
    }

    const firstChar = str[0];
    const uppercaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (firstChar === "_") {
        return "_camel";
    } else if (uppercaseAlphabet.includes(firstChar)) {
        return "pascal";
    } else {
        return "camel";
    }
}

function concat(...args) {
    return args.reduce((concatenated: [any], current: [any]) => {
        return concatenated.concat(current);
    }, []);
}

export default {
    arrayContainsAny,
    getCase,
    concat,
    getCharacters,
    stringBeginsWith,
    toCase,
};

export {
    arrayContainsAny,
    getCase,
    concat,
    getCharacters,
    stringBeginsWith,
    toCase,
};
