///</// <reference path="../typings/tsd.d.ts" />
var DeclarationInfo = require('../out/DeclarationInfo').DeclarationInfo;
var data = require('./commonTestData');

var getTarget = function(input){
	return new DeclarationInfo(input);
}
describe('DeclarationInfo', function () {
	describe("extract type", function () {
		it("should extract last word from first constructor parameter as a type", function () {
			var result = getTarget(data.WellKnownTextLine).getTypeName();
			expect(result).toBe(data.WellKnownInterface);
		});

		it("should extract last word from other constructor parameters as a type", function () {
			var testInput = " public TestConstructor(SomeType type, ISomeInterface ";
			var result = getTarget(testInput).getTypeName();
			expect(result).toBe(data.WellKnownInterface);
		});

		it('should correctly handle new line parameter definitions', function () {
			var input = "			ISomeType ";
			var result = getTarget(input).getTypeName();
			expect(result).toBe("ISomeType");
		});

		it('should handle "_" character', function () {
			var input = "		public ISomeType _";
			var result = getTarget(input).getTypeName();
			expect(result).toBe("ISomeType");
		});
	});
});