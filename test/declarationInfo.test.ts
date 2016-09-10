import DeclarationInfo from "../src/declarationInfo";
import data from "./commonTestData";
import { expect } from "chai";

function getTarget(input): DeclarationInfo {
    return new DeclarationInfo(input);
};

suite("DeclarationInfo", () => {
    suite("extracted typeName", () => {
        test("should be last word from first constructor parameter as a type", () => {
            const result = getTarget(data.WellKnownTextLine).getTypeName();
            expect(result).to.equal(data.WellKnownInterface);
        });

        test("should be last word from other constructor parameters as a type", () => {
            const testInput = " public TestConstructor(SomeType type, ISomeInterface ";
            const result = getTarget(testInput).getTypeName();
            expect(result).to.equal(data.WellKnownInterface);
        });

        test("should work properly with new line parameter definitions", () => {
            const input = "			" + data.WellKnownInterface + " ";
            const result = getTarget(input).getTypeName();
            expect(result).to.equal(data.WellKnownInterface);
        });

        test("should be correct if user input is present", () => {
            const input = "		public " + data.WellKnownInterface + " _";
            const result = getTarget(input).getTypeName();
            expect(result).to.equal(data.WellKnownInterface);
        });

        test("should be correct if variable name is defined", () => {
            const input = "   public " + data.WellKnownInterface + " someType ";
            const result = getTarget(input).getTypeName();
            expect(result).to.equal(data.WellKnownInterface);
        });

        test("should drop generic parameters", () => {
            const input = "     UserManager<ApplicationUser, IList<string>> ";
            const result = getTarget(input).getTypeName();
            expect(result).to.equal("UserManager");
        });
    });

    suite("when plural forms ", () => {
        test("should set isPlural property to true for array", () => {
            const input = data.WellKnownInterface + "[]";
            const target = getTarget(input);
            expect(target.isPlural()).to.equal(true);
            expect(target.getTypeName()).to.equal(data.WellKnownInterface);
        });

        ["ICollection", "ObservableCollection", "DbSet", "List"].forEach(typeName => {
            suite("for " + typeName, () => {
                const input = "     " + typeName + "<" + data.WellKnownInterface + "> ";

                test("should set isPlural property to true for " + typeName, () => {
                    const target = getTarget(input);
                    expect(target.isPlural()).to.equal(true);
                });

                test("should return generic type parameter as a type name for " + typeName, () => {
                    const target = getTarget(input);
                    expect(target.getTypeName()).to.equal(data.WellKnownInterface);
                });
            });
        });
    });

    suite("extracted userInput", () => {
        [{ line: data.WellKnownTextLine, userInput: "_" },
            { line: data.WellKnownTextLine, userInput: "my" }].forEach(td => {
                test("should be " + td.userInput, () => {
                    const input = td.line + td.userInput;
                    const result = getTarget(input).getUserInput();
                    expect(result).to.equal(td.userInput);
                });
            });
    });

    suite("extracted isVariableDeclared", () => {
        [{ text: data.WellKnownTextLine + "someType", expected: false },
            { text: data.WellKnownTextLine + "someType" + " ", expected: true }].forEach(td => {
                test("should be " + td.expected + " for " + "'" + td.text + "'", () => {
                    const result = getTarget(td.text).getIsVariableDeclared();
                    expect(result).to.equal(td.expected);
                });
            });
    });
});