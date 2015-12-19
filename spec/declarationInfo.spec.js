/// <reference path="../typings/tsd.d.ts" />

var DeclarationInfo = require("../out/declarationInfo").DeclarationInfo;
var data = require("./commonTestData");

var getTarget = function (input) {
	return new DeclarationInfo(input);
}
describe("DeclarationInfo", function () {
	describe("extracted typeName", function () {
		it("should be last word from first constructor parameter as a type", function () {
			var result = getTarget(data.WellKnownTextLine).getTypeName();
			expect(result).toBe(data.WellKnownInterface);
		});

		it("should be last word from other constructor parameters as a type", function () {
			var testInput = " public TestConstructor(SomeType type, ISomeInterface ";
			var result = getTarget(testInput).getTypeName();
			expect(result).toBe(data.WellKnownInterface);
		});

		it("should work properly with new line parameter definitions", function () {
			var input = "			" + data.WellKnownInterface + " ";
			var result = getTarget(input).getTypeName();
			expect(result).toBe(data.WellKnownInterface);
		});

		it("should be correct if user input is present", function () {
			var input = "		public " + data.WellKnownInterface + " _";
			var result = getTarget(input).getTypeName();
			expect(result).toBe(data.WellKnownInterface);
		});

		it("should be correct if variable name is defined", function () {
			var input = "   public " + data.WellKnownInterface + " someType ";
			var result = getTarget(input).getTypeName();
			expect(result).toBe(data.WellKnownInterface);
		});

		it("should drop generic parameters", function () {
			var input = "     UserManager<ApplicationUser, IList<string>> ";
			var result = getTarget(input).getTypeName();
			expect(result).toBe("UserManager");
		});
	});

	describe("when plural forms ", function () {
		it("should set isPlural property to true for array", function () {
			var input = data.WellKnownInterface + "[]";
			var target = getTarget(input);
			expect(target.isPlural()).toBe(true);
			expect(target.getTypeName()).toBe(data.WellKnownInterface);
		});

		["ICollection", "ObservableCollection", "DbSet", "List"].forEach(function (typeName) {
			describe("for " + typeName, function () {
				var input = "     " + typeName + "<" + data.WellKnownInterface + "> ";

				it("should set isPlural property to true for " + typeName, function () {
					var target = getTarget(input);
					expect(target.isPlural()).toBe(true);
				});

				it("should return generic type parameter as a type name for " + typeName, function () {
					var target = getTarget(input);
					expect(target.getTypeName()).toBe(data.WellKnownInterface);
				});
			});
		});
	});

	describe("extracted userInput", function () {
		[{ line: data.WellKnownTextLine, userInput: "_" },
			{ line: data.WellKnownTextLine, userInput: "my" }].forEach(function (td) {
				it("should be " + td.userInput, function () {
					var input = td.line + td.userInput;
					var result = getTarget(input).getUserInput();
					expect(result).toBe(td.userInput);
				});
			});
	});

	describe("extracted isVariableDeclared", function () {
		[{ text: data.WellKnownTextLine + "someType", expected: false },
			{ text: data.WellKnownTextLine + "someType" + " ", expected: true }].forEach(function (td) {
				it("should be " + td.expected + " for " + "'" + td.text + "'", function () {
					var result = getTarget(td.text).getIsVariableDeclared();
					expect(result).toBe(td.expected);
				});
			});
	});
});