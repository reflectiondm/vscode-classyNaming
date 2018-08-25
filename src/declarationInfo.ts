export default class DeclarationInfo {
    private reservedKeywords: string[] = [
        "public", "const", "internal", "static", "readonly", "private", "protected", "abstract", "int",
        "byte", "string", "double", "decimal", "var", "internal", "object", "float", "bool", "boolean",
        "class", "long", "out", "ref", "volatile", "sbyte", "short", "this", "uint", "ulong", "ushort",
        "virtual", "interface", "namespace"];

    private collectionTypes: string[] = ["Collection", "Set", "List", "Enumerable"];
    private innerGeneric: string = "";
    private isVariableDeclared: boolean = false;
    private isTypeDeclared: boolean = false;
    private fullTypeName: string;
    private typeName: string;
    private parameterDefinition: string;
    private userInput: string;
    private isPlural: boolean;
    private isPrivate: boolean;

    constructor(input: string) {
        this.isPlural = false;
        this.isPrivate = input.includes("private ");
        const conditionedInput = this.excludeGenerics(input);
        this.userInput = this.extractUserInput(conditionedInput);
        this.parameterDefinition = conditionedInput.substring(0, conditionedInput.length - this.userInput.length);
        const members = this.getMembers(this.parameterDefinition);
        this.fullTypeName = this.getTypeFromMembers(members);
        this.processFullTypeName();
    }

    public getIsVariableDeclared(): boolean {
        return this.isVariableDeclared;
    }

    public getIsTypeDeclared(): boolean {
        return this.isTypeDeclared;
    }

    public getFullTypeName(): string {
        return this.fullTypeName;
    }

    public getTypeName(): string {
        return this.typeName;
    }

    public getParameterDefinition(): string {
        return this.parameterDefinition;
    }

    public getUserInput(): string {
        return this.userInput;
    }

    public getIsPlural(): boolean {
        return this.isPlural;
    }

    public getIsPrivate(): boolean {
        return this.isPrivate;
    }

    private excludeGenerics(input: string): string {
        let result = "";
        let bracketCount = 0;
        for (const char of input) {
            if (char === "<") {
                bracketCount++;
                this.isTypeDeclared = false;
                continue;
            }

            if (char === ">") {
                bracketCount--;
                continue;
            }

            if (bracketCount === 0) {
                this.isTypeDeclared = true;
                result += char;
            } else {
                this.innerGeneric += char;
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
    }

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
        const end = input.length;
        for (let i = input.length - 1; i > 0; i--) {
            if (this.isMemberSeparator(input[i])) {
                return input.substring(i + 1, end);
            }
        }
        return input.substring(0, end);
    }

    private getTypeFromMembers(members: string[]): string {
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (member === "" || this.isReservedKeyword(member)) {
                continue;
            }
            if (i !== members.length - 1) {
                this.isVariableDeclared = true;
            }
            return member;
        }
        return "";
    }

    private isReservedKeyword(extractedType: string): boolean {
        return this.reservedKeywords.some((el) => el === extractedType);
    }

    private processFullTypeName(): void {
        if (this.fullTypeName.endsWith("[]")) {
            this.isPlural = true;
            this.typeName = this.fullTypeName.substring(0, this.fullTypeName.length - 2);
            return;
        }

        if (this.collectionTypes.find((d) => this.fullTypeName.endsWith(d))) {
            this.isPlural = true;
            this.typeName = this.innerGeneric;
            this.fullTypeName += "<" + this.innerGeneric + ">";
            return;
        }

        this.typeName = this.fullTypeName;
    }
}
