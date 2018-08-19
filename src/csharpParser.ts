import DeclarationInfo from "./declarationInfo";
import { plural as pluralize } from "pluralize";
import { stringBeginsWith, arrayIncludesAny } from './utils';

export class CsharpParser {
    public splitTypeName(typeName: string): string[] {
        const re = /([A-Za-z]?)([a-z]+)/g;

        let match = re.exec(typeName);
        const result: string[] = [];
        while (match) {
            if (match[1]) {
                result.push([match[1].toUpperCase(), match[2]].join(""));
            } else {
                result.push(match[0]);
            }
            match = re.exec(typeName);
        }
        return result.map((m) => m.toLowerCase());
    }

    public getPascalSuggestions(parts: string[]): string[] {
        const result = [];
        for (let i = parts.length - 1; i >= 0; i--) {
            let suggestion = "";
            for (let j = i; j < parts.length; j++) {
                suggestion += this.toCase("pascal", parts[j]);
            }

            result.push(suggestion);
        }

        return result;
    }

    public getSuggestions(declarationInfo: DeclarationInfo): string[] {
        if (declarationInfo.getIsVariableDeclared() || !declarationInfo.getIsTypeDeclared()) {
            return [];
        }

        const userInput = declarationInfo.getUserInput();
        const isPrivate = declarationInfo.getIsPrivate();

        const typeName = declarationInfo.getIsPlural() ? pluralize(declarationInfo.getTypeName()) : declarationInfo.getTypeName();
        const splitTypeName = this.splitTypeName(typeName);

        const allowedCases: IAllowedCases = { camel: true, _camel: isPrivate && !userInput, pascal: !isPrivate };
        return this.generateSuggestions(userInput, splitTypeName, allowedCases);
    }

    public getParsingResult(input: string): IParsingResult {
        const declarationInfo = new DeclarationInfo(input);
        const typeName = declarationInfo.getFullTypeName();
        const suggestions = this.getSuggestions(declarationInfo);
        const userInput = declarationInfo.getUserInput();
        return { suggestions, typeName, userInput };
    }

    private generateSuggestions(userInput: string, splitTypeName: string[], allowedCases: IAllowedCases): string[] {
        let prefix = "";
        if (userInput) {
            prefix = splitTypeName.find((word) => word.toLowerCase().includes(userInput.toLowerCase())) || userInput;
        }

        const result: string[] = [];

        const suggestions = this.getPascalSuggestions(splitTypeName);
        for (let Suggestion of suggestions) {
            // tslint:disable-next-line:variable-name
            let _suggestion = this.toCase("_camel", Suggestion);
            let suggestion = this.toCase("camel", Suggestion);

            if (!stringBeginsWith(Suggestion, prefix, { caseSensitive: false })) {
                _suggestion = this.toCase("_camel", prefix + Suggestion);
                suggestion = this.toCase("camel", prefix + Suggestion);
                Suggestion = this.toCase("pascal", prefix + Suggestion);
            }

            if (arrayIncludesAny(result, Suggestion, suggestion, _suggestion)) {
                break;
            }

            if (this.caseOf(userInput) === "_camel") {
                allowedCases.pascal = false;
                allowedCases._camel = true;
            } else if (this.caseOf(userInput) === "pascal") {
                allowedCases.pascal = true;
                allowedCases._camel = false;
            }

            if (allowedCases.pascal) {
                result.push(Suggestion);
            }
            if (allowedCases.camel) {
                result.push(suggestion);
            }
            if (allowedCases._camel) {
                result.push(_suggestion);
            }
        }

        return result;
    }

    private toCase(toType: 'pascal' | 'camel' | '_camel', str: string): string {
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

    private caseOf(str: string): 'pascal' | 'camel' | '_camel' {
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
}

interface IAllowedCases {
    pascal: boolean;
    _camel: boolean;
    camel: boolean;
}

export interface IParsingResult {
    suggestions: string[];
    typeName: string;
    userInput: string;
}
