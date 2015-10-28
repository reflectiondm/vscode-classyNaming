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
			suggestion = suggestion[0].toLowerCase() + suggestion.substring(1);
			result.push(suggestion);
		}
		return result;
	}

	public getSuggestions(input: string): string[] {
		var declarationInfo = new di.DeclarationInfo(input);
		var nameParts = this.splitTypeName(declarationInfo.getTypeName());
		var result = this.combineSuggestions(nameParts);
		return result;
	}
}