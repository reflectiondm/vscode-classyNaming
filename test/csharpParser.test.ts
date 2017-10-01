import { CsharpParser } from "../src/csharpParser";
import data from "./commonTestData";
import { expect } from "chai";

suite("C# parser", () => {
    const target = new CsharpParser();
    const wellKnownInterface = "ISomeInterface";
    const wellKnownTextLine = " public TestConstructor(ISomeInterface ";

    suite("split type name", () => {
        test("should break the interface in parts based on case, without I, lowercased", () => {
            const result = target.splitTypeName(wellKnownInterface);
            expect(result).to.eql(["some", "interface"]);
        });

        test("should break the className in parts based on case, lowercased", () => {
            const result = target.splitTypeName("TestCaseServiceProvider");
            expect(result).to.eql(["test", "case", "service", "provider"]);
        });
    });

    suite("getParsingResult", () => {
        suite("suggestions", () => {
            const getSuggestions = (input) => {
                return target.getParsingResult(input).suggestions;
            };

            [wellKnownTextLine,
                " public static TestConstructor(ISomeInterface ",
                " public readonly TestConstructor(ISomeInterface "]
                .forEach((line) => {
                    test("should be able to provide suggested names", () => {
                        const result = getSuggestions(line);
                        expect(result).to.eql([
                            "interface",
                            "someInterface",
                        ]);
                    });
                });

            // TODO: make this pass:
            // test("should not react on incompleted assignments", () => {
            //     const result = getSuggestions(" public TestConstructor(ISomeInterface");
            //     expect(result).to.eql([]);
            // });

            ["public", "private", "const", "static", "readonly", "protected", "abstract", "int", "class",
                "string", "decimal", "var", "float", "bool", "boolean"].forEach((ignoreCase) => {
                    test("should ignore " + ignoreCase + " keyword", () => {
                        const input = "   " + ignoreCase + " ";
                        const result = getSuggestions(input);
                        expect(result).to.eql([]);
                    });
                });

            test("should detect that the variable has already been provided", () => {
                const input = "  public ISomeType someType ";
                const result = getSuggestions(input);
                expect(result).to.eql([]);
            });

            test("should provide suggestions with user input", () => {
                const input = "  public ISomeType my";
                const result = getSuggestions(input);
                expect(result).to.contain("mySomeType");
            });

            test("should merge user input with name part if they are alike", () => {
                const input = "  public ISomeComplexType som";
                const result = getSuggestions(input);
                expect(result).to.eql(["someType", "someComplexType"]);
            });

            test("should not provide duplicate suggestions", () => {
                const input = "  public ISomeType some";
                const result = getSuggestions(input);
                expect(result).to.eql(["someType"]);
            });

            test("should provide suggestions with lowercase character after  _ ", () => {
                const input = "  public ISomeType _";
                const result = getSuggestions(input);
                expect(result).to.contain("_someType");
                expect(result).to.contain("_type");
            });

            ["ICollection", "ObservableCollection", "DbSet", "List", "IEnumerable", "IList", "LinkedList"]
            .forEach((typeName) => {
                test("should pluralize suggested name for collections like " + typeName, () => {
                    const input = "   public " + typeName + "<" + data.WellKnownInterface + "> ";
                    const result = getSuggestions(input);
                    expect(result).to.contain("someInterfaces");
                    expect(result).to.contain("interfaces");
                });
            });

            test("should not complete unfinished generic definitions", () => {
                const input = "		IList<FooBo";
                const result = getSuggestions(input);
                expect(result).to.eql([]);
            });

            [["Box", "boxes"],
            ["Cross", "crosses"],
            ["Index", "indices"]].forEach((param) => {
                test("should use correct plural form for " + param[0], () => {
                    const fullTypeName = "List<" + param[0] + ">";
                    const input = "   public " + fullTypeName + " ";
                    const result = target.getParsingResult(input);
                    const suggestions = result.suggestions;
                    const typeName = result.typeName;
                    expect(suggestions).to.contain(param[1]);
                    expect(typeName).to.equal(fullTypeName);
                });
            });
        });

        test("should contain typeName", () => {
            const input = data.WellKnownTextLine;
            const result = target.getParsingResult(input).typeName;
            expect(result).to.equal(data.WellKnownInterface);
        });

        test("should igore multiple keywords", () => {
            const input = " private const ISomeInterface ";
            const result = target.getParsingResult(input).typeName;
            expect(result).to.equal("ISomeInterface");
        });
    });
});
