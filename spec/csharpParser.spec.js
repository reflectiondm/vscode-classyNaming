/// <reference path="../typings/tsd.d.ts" />
var Parser = require('../out/csharpParser').CsharpParser;

describe("C# parser that extracts types from plaintext string", function(){
	var target = new Parser();
	
	it("should extract last word from first constructor parameter as a type", function(){
		var testInput = " public TestConstructor(ISomeInterface ";
		var result = target.extractType(testInput);
		expect(result).toBe("ISomeInterface");
	});
	
	it("should extract last word from other constructor parameters as a type", function(){
		var testInput = " public TestConstructor(SomeType type, ISomeInterface ";
		var result = target.extractType(testInput);
		expect(result).toBe("ISomeInterface");
	});
});