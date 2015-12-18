export class DeclarationInfo {
  private reservedKeywords: string[] = ["public", "private", "protected", "abstract", "int",
     "string", "decimal", "var", "float", "bool", "boolean", "class"];

     constructor(input: string) {
       let conditionedInput = this.excludeGenerics(input);
       this._userInput = this.extractUserInput(conditionedInput);
       this._parameterDefinition = conditionedInput.substring(0, conditionedInput.length - this._userInput.length);
       let members = this.getMembers(this._parameterDefinition);
       this._fullTypeName = this.getTypeFromMembers(members);
       this.processFullTypeName();
    }

    private _isVariableDeclared: boolean = false;
    public getIsVariableDeclared(): boolean {
        return this._isVariableDeclared;
    }

    private _fullTypeName: string;
    public getFullTypeName(): string {
        return this._fullTypeName;
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

	private _isPlural: boolean;
	public isPlural(): boolean {
		return this._isPlural;
	}

	private excludeGenerics(input: string): string {
		let result = "";
		let bracketCount = 0;
		for (let i = 0; i < input.length; i++) {
			let char = input[i];
			if (char === "<") {
				bracketCount++;
			}

			if (bracketCount === 0) {
				result += char;
			}

			if (char === ">") {
				bracketCount--;
			}
		}

		return result;
	}

	private extractUserInput(input: string): string {
		for (let i = input.length - 1; i >= 0; i--) {
			if (this.isMemberSeparator(input[i]) || input[i] === " ") {
				return input.substring(i).trim();
			}
		}
		return "";
	};

	private isMemberSeparator(c: string): boolean {
		return c === "("
			|| c === ",";
	}

	private getMembers(membersDeclaration: string): string[] {
		return this.getMostLikelyMemberDeclaration(
			membersDeclaration.trim())
			.split(" ");
	}

	private getMostLikelyMemberDeclaration(input: string): string {
		let end = input.length;
		for (let i = input.length - 1; i > 0; i--) {
			if (this.isMemberSeparator(input[i])) {
				return input.substring(i + 1, end);
			}
		}
		return input.substring(0, end);
	}

	private getTypeFromMembers(members: string[]): string {
		for (let i = 0; i < members.length; i++) {
			let member = members[i];
			if (member === "" || this.isReservedKeyword(member)) {
				continue;
			}
			if (i !== members.length - 1) {
				this._isVariableDeclared = true;
			}
			return member;
		}
		return "";
	}

	private isReservedKeyword(extractedType: string): boolean {
		return this.reservedKeywords.some((el) => el === extractedType);
	}

    private processFullTypeName(): void {
		if (this._fullTypeName.endsWith("]")) {
			this._isPlural = true;
			this._typeName = this._fullTypeName.substring(0, this._fullTypeName.length - 3);
		}
		this._typeName = this._fullTypeName;
	}
}