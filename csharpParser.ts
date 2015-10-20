export class CsharpParser {
	private reservedKeywords: string[] = ['public', 'private', 'protected', 'abstract', 'int',
		'string', 'decimal', 'var', 'float', 'bool', 'boolean'];

	public extractType(input: string): string {
		var sanitized = input.trim();
		var result = '';
		for (i = sanitized.length - 1; i > 0; i--) {
			if (this.isMemberSeparator(sanitized[i])) {
				sanitized = sanitized.substring(i + 1);
				break;
			}
		}
		var members = sanitized.split(" ");
		for (var i = 0; i < members.length; i++) {
			var member = members[i];
			if (member == '' || this.isReservedKeyword(member)) {
				continue;
			}
			if (i == members.length - 1) {
				result = member;
			}
			else {
				// member name seems to be already provided in that case
				result = '';
				break;
			}
		}

		return result;
	}

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
			var suggestion = '';
			for (var j = i; j < parts.length; j++) {
				suggestion += parts[j];
			}
			suggestion = suggestion[0].toLowerCase() + suggestion.substring(1);
			result.push(suggestion);
		}
		return result;
	}

	public getSuggestions(input: string): string[] {
		var typeName = this.extractType(input);
		var nameParts = this.splitTypeName(typeName);
		var result = this.combineSuggestions(nameParts);
		return result;
	}

	private isMemberSeparator(c: string): boolean {
		return c == '('
			|| c == ',';
	}

	private isReservedKeyword(extractedType: string): boolean {
		return this.reservedKeywords.some((el) => el == extractedType);
	}
}