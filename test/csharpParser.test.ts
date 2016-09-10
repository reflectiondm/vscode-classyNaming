/// <reference path="../typings/tsd.d.ts" />
import {CsharpParser} from "../src/csharpParser";
import data from "./commonTestData";
import { expect } from "chai";

suite("C# parser", function () {
    const target = new CsharpParser();
    const wellKnownInterface = "ISomeInterface";
    const wellKnownTextLine = " public TestConstructor(ISomeInterface ";

    suite("split type name", function () {
        test("should break the interface in parts based on case, without I", function () {
            const result = target.splitTypeName(wellKnownInterface);
            expect(result).to.eql(["Some", "Interface"]);
        });

        test("should break the className in parts based on case", function () {
            const result = target.splitTypeName("TestCaseServiceProvider");
            expect(result).to.eql(["Test", "Case", "Service", "Provider"]);
        });
    });

    suite("getParsingResult", function () {
        suite("suggestions", function () {
            const getSuggestions = function (input) {
                return target.getParsingResult(input).suggestions;
            };

            [wellKnownTextLine,
                " public static TestConstructor(ISomeInterface ",
                " public readonly TestConstructor(ISomeInterface "]
                .forEach(() => {
                    test("should be able to provide suggested names", function () {
                        const result = getSuggestions(wellKnownTextLine);
                        expect(result).to.eql([
                            "interface",
                            "someInterface"
                        ]);
                    });
                });


            ["public", "private", "static", "readonly", "protected", "abstract", "int", "class",
                "string", "decimal", "var", "float", "bool", "boolean"].forEach(function (ignoreCase) {
                    test("should ignore " + ignoreCase + " keyword", function () {
                        const input = "   " + ignoreCase + " ";
                        const result = getSuggestions(input);
                        expect(result).to.eql([]);
                    });
                });

            test("should detect that the variable has already been provided", function () {
                const input = "  public ISomeType someType ";
                const result = getSuggestions(input);
                expect(result).to.eql([]);
            });

            test("should provide suggestions with user input", function () {
                const input = "  public ISomeType my";
                const result = getSuggestions(input);
                expect(result).to.contain("mySomeType");
            });

            test("should provide suggestions with lowercase character after  _ ", function () {
                const input = "  public ISomeType _";
                const result = getSuggestions(input);
                expect(result).to.contain("_someType");
                expect(result).to.contain("_type");
            });

            ["ICollection", "ObservableCollection", "DbSet", "List", "IEnumerable", "IList", "LinkedList", ].forEach(function (typeName) {
                test("should pluralize suggested name for collections like " + typeName, function () {
                    const input = "   public " + typeName + "<" + data.WellKnownInterface + "> ";
                    const result = getSuggestions(input);
                    expect(result).to.contain("someInterfaces");
                    expect(result).to.contain("interfaces");
                });
            });

            [["Box", "boxes"],
                ["Cross", "crosses"],
                ["Index", "indices"]].forEach(function (param) {
                    test("should use correct plural form for " + param[0], function () {
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

        test("should contain typeName", function () {
            const input = data.WellKnownTextLine;
            const result = target.getParsingResult(input).typeName;
            expect(result).to.equal(data.WellKnownInterface);
        });
    });
});