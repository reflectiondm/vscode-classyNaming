// TODO rename variables to domain related names
import * as di from "./declarationInfo";

export class CsharpParser {
    public splitTypeName(typeName: string): string[] {
        let re = /([A-Za-z]?)([a-z]+)/g;

        let match = re.exec(typeName);
        let result: string[] = [];
        while (match) {
            if (match[1]) {
                result.push([match[1].toUpperCase(), match[2]].join(""));
            }
            else {
                result.push(match[0]);
            }
            match = re.exec(typeName);
        }
        return result;
    }

    public combineSuggestions(parts: string[]): string[] {
        let result = [];
        for (let i = parts.length - 1; i >= 0; i--) {
            let suggestion = "";
            for (let j = i; j < parts.length; j++) {
                suggestion += parts[j];
            }
            suggestion = this.ToCamel(suggestion);
            result.push(suggestion);
        }
        return result;
    }

    public getSuggestions(declarationInfo: di.DeclarationInfo): string[] {
        if (declarationInfo.getIsVariableDeclared()) {
            return [];
        }

        let typeName = declarationInfo.isPlural() ?
            declarationInfo.getTypeName() + "s" :
            declarationInfo.getTypeName();

        let nameParts = this.splitTypeName(typeName);
        let suggestions = this.combineSuggestions(nameParts);
        let result = [];
        let userInput = declarationInfo.getUserInput();
        if (userInput !== "") {
            suggestions.forEach((s) => result.push(this.combineWithUserInput(s, userInput)));
        }
        else {
            suggestions.forEach((s) => result.push(s));
        }
        return result;
    }

    public getParsingResult(input: string): ParsingResult {
        var declarationInfo = new di.DeclarationInfo(input);
        var typeName = declarationInfo.getTypeName();
        var suggestions = this.getSuggestions(declarationInfo);
        var userInput = declarationInfo.getUserInput();
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