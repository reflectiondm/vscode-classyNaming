// TODO rename variables to domain related names
import * as di from './DeclarationInfo';

export class CsharpParser {
	public splitTypeName(typeName: string): string[] {
		var re = /([A-Za-z]?)([a-z]+)/g;

		var match = re.exec(typeName);
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
		var result = [];
		for (var i = parts.length - 1; i >= 0; i--) {
			var suggestion = "";
			for (var j = i; j < parts.length; j++) {
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
		var nameParts = this.splitTypeName(declarationInfo.getTypeName());
		var suggestions = this.combineSuggestions(nameParts);
		var result = [];
		var userInput = declarationInfo.getUserInput();
		if (userInput != "") {
			suggestions.forEach((s) => result.push(userInput + this.ToPascal(s)));
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
		return new ParsingResult(suggestions, typeName);
	}

	private ToPascal(input: string): string {
		return input[0].toUpperCase() + input.substring(1);
	}

	private ToCamel(input: string): string {
		return input[0].toLowerCase() + input.substring(1);
	}
}

export class ParsingResult {
	constructor(suggestions: string[], typeName: string) {
		this.suggestions = suggestions;
		this.typeName = typeName;
	}
	public suggestions: string[];
	public typeName: string;
}