export class DeclarationInfo {
	private reservedKeywords: string[] = ["public", "private", "protected", "abstract", "int",
		"string", "decimal", "var", "float", "bool", "boolean", "class"];

	constructor(input: string) {
		var conditionedInput = this.excludeGenerics(input);
		this._userInput = this.extractUserInput(conditionedInput);
		this._parameterDefinition = conditionedInput.substring(0, conditionedInput.length - this._userInput.length);
		var members = this.getMembers(this._parameterDefinition);
		this._typeName = this.getTypeFromMembers(members);
	}

	private _isVariableDeclared: boolean = false;
	public getIsVariableDeclared(): boolean {
		return this._isVariableDeclared;
	}

	private _typeName: string;
	public getTypeName(): string {
		return this._typeName;
	}

	private _parameterDefinition: string;
	public getParameterDefinition(): string {
		return this._parameterDefinition;
	}

	private _userInput: string;
	public getUserInput(): string {
		return this._userInput;
	}

	private excludeGenerics(input: string): string {
		var result = "";
		var bracketCount = 0;
		for (var i = 0; i < input.length; i++) {
			var char = input[i];
			if (char == '<') {
				bracketCount++;
			}

			if (bracketCount == 0) {
				result += char;
			}
			
			if (char == '>') {
				bracketCount--;
			}
		}

		return result;
	}

	private extractUserInput(input: string): string {
		for (var i = input.length - 1; i >= 0; i--) {
			if (this.isMemberSeparator(input[i]) || input[i] == " ") {
				return input.substring(i).trim();
			}
		}
		return "";
	};

	private isMemberSeparator(c: string): boolean {
		return c == "("
			|| c == ",";
	}

	private getMembers(membersDeclaration: string): string[] {
		return this.getMostLikelyMemberDeclaration(
			membersDeclaration.trim())
			.split(" ");
	}

	private getMostLikelyMemberDeclaration(input: string): string {
		var end = input.length;
		for (var i = input.length - 1; i > 0; i--) {
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
			if (i != members.length - 1) {
				this._isVariableDeclared = true;
			}
			return member;
		}
		return "";
	}

	private isReservedKeyword(extractedType: string): boolean {
		return this.reservedKeywords.some((el) => el == extractedType);
	}
}