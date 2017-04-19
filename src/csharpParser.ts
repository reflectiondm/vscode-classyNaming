import DeclarationInfo from "./declarationInfo";
import * as pluralizer from "pluralize";

export class CsharpParser {
    public splitTypeName(typeName: string): string[] {
        const re = /([A-Za-z]?)([a-z]+)/g;

        let match = re.exec(typeName);
        const result: string[] = [];
        while (match) {
            if (match[1]) {
                result.push([match[1].toUpperCase(), match[2]].join(""));
            }
            else {
                result.push(match[0]);
            }
            match = re.exec(typeName);
        }
        return result.map(m => m.toLowerCase());
    }

    public combineSuggestions(parts: string[]): string[] {
        const result = [];
        for (let i = parts.length - 1; i >= 0; i--) {
            let suggestion = "";
            for (let j = i; j < parts.length; j++) {
                suggestion += this.ToPascal(parts[j]);
            }
            suggestion = this.ToCamel(suggestion);
            result.push(suggestion);
        }
        return result;
    }

    public getSuggestions(declarationInfo: DeclarationInfo): string[] {
        if (declarationInfo.getIsVariableDeclared()) {
            return [];
        }

        const typeName = declarationInfo.isPlural() ?
            pluralizer.plural(declarationInfo.getTypeName()) :
            declarationInfo.getTypeName();

        const nameParts = this.splitTypeName(typeName);
        const suggestions = this.combineSuggestions(nameParts);
        const result = new Set();
        const userInput = declarationInfo.getUserInput();
        const prefix = nameParts.find(part => part.includes(userInput)) || userInput;
        if (userInput !== "") {
            suggestions.map(s => s.includes(prefix, 0) ? s : this.combineWithUserInput(s, prefix))
                .forEach(s => result.add(s));
        } else {
            suggestions.forEach((s) => result.add(s));
        }

        return [...result];
    }

    public getParsingResult(input: string): ParsingResult {
        const declarationInfo = new DeclarationInfo(input);
        const typeName = declarationInfo.getFullTypeName();
        const suggestions = this.getSuggestions(declarationInfo);
        const userInput = declarationInfo.getUserInput();
        return new ParsingResult(suggestions, typeName, userInput);
    }

    private ToPascal(input: string): string {
        return input[0].toUpperCase() + input.substring(1);
    }

    private ToCamel(input: string): string {
        return input[0].toLowerCase() + input.substring(1);
    }

    private combineWithUserInput(suggestion: string, userInput: string): string {
        return userInput === "_" ?
            userInput + suggestion :
            userInput + this.ToPascal(suggestion);
    }
}

export class ParsingResult {
    constructor(suggestions: string[], typeName: string, userInput: string) {
        this.suggestions = suggestions;
        this.typeName = typeName;
        this.userInput = userInput;
    }
    public suggestions: string[];
    public typeName: string;
    public userInput: string;
}
