import sut from "./../src/utils";
import { expect } from "chai";

suite("utils", () => {
    suite("getCharacters", () => {
        [{ from: "a", to: "d", expectedResult: ["a", "b", "c", "d"] },
        { from: "a", to: "b", expectedResult: ["a", "b"] },
        { from: "A", to: "D", expectedResult: ["A", "B", "C", "D"] },
        { from: "A", to: "A", expectedResult: ["A"] },
        ].forEach((testCase) => {
            suite(`from ${testCase.from} to ${testCase.to}`, () => {
                let result;
                suiteSetup(() => {
                    result = sut.getCharacters(testCase.from, testCase.to);
                });

                test(`should return ${testCase.expectedResult}`, () => {
                    expect(result).to.eql(testCase.expectedResult);
                });
            });
        });
    });

    suite("concat", () => {
        test("one argument should return itself", () => {
            const result = sut.concat(["a", "b"]);
            expect(result).to.eql(["a", "b"]);
        });

        test("two argument should return concatenated", () => {
            const result = sut.concat(["a", "b"], ["c"]);
            expect(result).to.eql(["a", "b", "c"]);
        });

        test("three argument should return concatenation of three arrays", () => {
            const result = sut.concat(["a", "b"], ["c"], "d", "e");
            expect(result).to.eql(["a", "b", "c", "d", "e"]);
        });
    });

    suite("stringBeginsWith", () => {
        test("returns false for str = ''", () => {
            expect(sut.stringBeginsWith("", "abc")).to.eql(false);
        });

        test("returns true for empty substr = ''", () => {
            expect(sut.stringBeginsWith("abc", "")).to.eql(true);
        });

        test("returns true when str begins with substr", () => {
            expect(sut.stringBeginsWith("abcABC i am testing", "abcABC i")).to.eql(true);
        });

        test("returns false when str doesn't begin with substr", () => {
            expect(sut.stringBeginsWith("abcABC i am testing", "abcd")).to.eql(false);
        });
    });

    suite("arrayContainsAny", () => {
        test("returns false for array = []", () => {
            expect(sut.arrayContainsAny([], 2)).to.eql(false);
        });

        test("returns true for values = []", () => {
            expect(sut.arrayContainsAny([1, 2, 3], ...[])).to.eql(true);
        });

        test("returns true for values = undefined", () => {
            expect(sut.arrayContainsAny([1, 2, 3])).to.eql(true);
        });

        test("returns true when array contains a value", () => {
            expect(sut.arrayContainsAny([1, 2, 3], 2, 3)).to.eql(true);
        });

        test("returns true when array contains a value", () => {
            expect(sut.arrayContainsAny([1, 2, 3], 4, 5, 6)).to.eql(false);
        });
    });

    suite("getCase and toCase", () => {
        test("getCase for pascal", () => {
            expect(sut.getCase("PascalText")).to.eql("pascal");
        });

        test("getCase for camel", () => {
            expect(sut.getCase("camelText")).to.eql("camel");
        });

        test("getCase for _camel", () => {
            expect(sut.getCase("_underscoreText")).to.eql("_camel");
        });

        test("getCase for '_'", () => {
            expect(sut.getCase("_")).to.eql("_camel");
        });

        test("getCase for ''", () => {
            expect(sut.getCase("")).to.eql(null);
        });

        test("toCase for ''", () => {
            expect(sut.toCase("pascal", "")).to.eql("");
        });

        test("toCase _camel for '_'", () => {
            expect(sut.toCase("_camel", "_")).to.eql("_");
        });

        test("toCase Pascal for '_'", () => {
            expect(sut.toCase("pascal", "_")).to.eql("");
        });

        test("toCase _camel", () => {
            expect(sut.toCase("_camel", "MyClass")).to.eql("_myClass");
        });

        test("toCase camel", () => {
            expect(sut.toCase("camel", "_iValuePrivacy")).to.eql("iValuePrivacy");
        });

        test("toCase Pascal", () => {
            expect(sut.toCase("pascal", "aWildCamel")).to.eql("AWildCamel");
        });
    });
});
