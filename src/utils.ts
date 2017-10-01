function getCharacters(from: string, to: string): string[] {
    const fromCode = from.charCodeAt(0);
    const toCode = to.charCodeAt(0);
    const result: string[] = [];
    for (let i = fromCode; i <= toCode; i++) {
        result.push(String.fromCharCode(i));
    }
    return result;
}

function concat(...args) {
    return args.reduce((concatenated: [any], current: [any]) => {
        return concatenated.concat(current);
    }, []);
}

export default {
    getCharacters,
    concat,
};

export { getCharacters, concat };
