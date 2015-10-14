/// <reference path="../typings/tsd.d.ts" />
var Parser = require('../out/csharpParser').CsharpParser;

describe("C# parser that extracts types from plaintext string", function(){
	var target = new Parser();
	var wellKnownInterface = "ISomeInterface";
	it("should extract last word from first constructor parameter as a type", function(){
		var testInput = " public TestConstructor(ISomeInterface ";
		var result = target.extractType(testInput);
		expect(result).toBe(wellKnownInterface);
	});
	
	it("should extract last word from other constructor parameters as a type", function(){
		var testInput = " public TestConstructor(SomeType type, ISomeInterface ";
		var result = target.extractType(testInput);
		expect(result).toBe(wellKnownInterface);
	});
	
	it("should break the interface in parts based on case, without I", function(){
		var result = target.SplitTypeName(wellKnownInterface);
		expect(result).toEqual(["Some", "Interface"]);
	});
	
	it("should break the className in parts based on case", function(){
		var result = target.SplitTypeName("TestCaseServiceProvider");
		expect(result).toEqual(["Test", "Case", "Service", "Provider"]);
	});
});