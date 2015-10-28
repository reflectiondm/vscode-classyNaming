export class DeclarationInfo {
	private reservedKeywords: string[] = ["public", "private", "protected", "abstract", "int",
		"string", "decimal", "var", "float", "bool", "boolean", "class"];

	constructor(input: string) {
		this._userInput = this.extractUserInput(input);
		this._parameterDefinition = input.substring(0, input.length - this._userInput.length);
		this._type = this.extractType(this._parameterDefinition);
	}

	private _type: string;
	public getTypeName(): string {
		return this._type;
	}

	private _parameterDefinition: string;
	public getParameterDefinition(): string {
		return this._parameterDefinition;
	}

	private _userInput: string;
	public getUserInput(): string {
		return this._userInput;
	}

	public extractUserInput(input: string): string {
		for (var i = input.length - 1; i >= 0; i--) {
			if (this.isMemberSeparator(input[i])) {
				return input.substring(i);
			}
		}
		return "";
	};

	private isMemberSeparator(c: string): boolean {
		return c == "("
			|| c == ","
			|| c == " ";
	}

	private extractType(defintion: string): string {
		var memberDeclaration = this.getMostLikelyMemberDeclaration(defintion.trim());
		var members = memberDeclaration.split(" ");
		var result = this.getTypeFromMembers(members);

		return result;
	}

	private getMostLikelyMemberDeclaration(input: string): string {
		var end = input.length;
		for (var i = input.length - 1; i > 0; i--) {
			if (input[i] == "_") {
				end--;
			}
			if (this.isMemberSeparator(input[i])) {
				return input.substring(i + 1, end);
			}
		}
		return input.substring(0, end);
	}

	private getTypeFromMembers(members: string[]): string {
		for (var i = 0; i < members.length; i++) {
			var member = members[i];
			if (member == "" || this.isReservedKeyword(member)) {
				continue;
			}
			if (i == members.length - 1) {
				return member;
			}
			else {
				// member name seems to be already provided in that case
				return "";
			}
		}
		return "";
	}

	private isReservedKeyword(extractedType: string): boolean {
		return this.reservedKeywords.some((el) => el == extractedType);
	}

}