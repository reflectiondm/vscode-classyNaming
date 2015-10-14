export class CsharpParser {
	public extractType(input: string): string {
		var sanitize = input.trim();
		var result = '';
		for (var i = sanitize.length - 1; i > 0; i--) {
			if (this.isMemberSeparator(sanitize[i])) {
				result = sanitize.substring(i + 1);
				break;
			}
		}
		return result;
	}

	public SplitTypeName(typeName: string): string[] {
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

	private isMemberSeparator(c: string): boolean {
		return c == '('
			|| c == ' ';
	}
}