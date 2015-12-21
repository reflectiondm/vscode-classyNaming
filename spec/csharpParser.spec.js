/// <reference path="../typings/tsd.d.ts" />
var Parser = require('../out/csharpParser').CsharpParser;
var data = require('./commonTestData');

describe("C# parser", function () {
	var target = new Parser();
	var wellKnownInterface = "ISomeInterface";
	var wellKnownTextLine = " public TestConstructor(ISomeInterface ";

	describe('split type name', function () {
		it("should break the interface in parts based on case, without I", function () {
			var result = target.splitTypeName(wellKnownInterface);
			expect(result).toEqual(["Some", "Interface"]);
		});

		it("should break the className in parts based on case", function () {
			var result = target.splitTypeName("TestCaseServiceProvider");
			expect(result).toEqual(["Test", "Case", "Service", "Provider"]);
		});
	});

	describe("getParsingResult", function () {
		describe('suggestions', function () {
			var getSuggestions = function (input) {
				return target.getParsingResult(input).suggestions;
			}
			it('should be able to provide suggested names', function () {
				var result = getSuggestions(wellKnownTextLine);
				expect(result).toEqual([
					'interface',
					'someInterface'
				]);
			});

			['public', 'private', 'protected', 'abstract', 'int', 'class',
				'string', 'decimal', 'var', 'float', 'bool', 'boolean'].forEach(function (ignoreCase) {
					it('should ignore ' + ignoreCase + ' keyword', function () {
						var input = "   " + ignoreCase + ' ';
						var result = getSuggestions(input);
						expect(result).toEqual([]);
					});
				});

			it('should detect that the variable has already been provided', function () {
				var input = "  public ISomeType someType ";
				var result = getSuggestions(input);
				expect(result).toEqual([]);
			});

			it('should provide suggestions with user input', function () {
				var input = "  public ISomeType my";
				var result = getSuggestions(input);
				expect(result).toContain("mySomeType");
			});

			it('should provide suggestions with lowercase character after  _ ', function () {
				var input = "  public ISomeType _";
				var result = getSuggestions(input);
				expect(result).toContain("_someType");
				expect(result).toContain("_type");
			});

			["ICollection", "ObservableCollection", "DbSet", "List", "IEnumerable", "IList", "LinkedList", ].forEach(function (typeName) {
				it("should pluralize suggested name for collections like " + typeName, function () { 
					var input = "   public " + typeName + "<" + data.WellKnownInterface + "> ";
					var result = getSuggestions(input);
					expect(result).toContain("someInterfaces");
					expect(result).toContain("interfaces");
				});
			});
            
            [   ["Box", "boxes"], 
                ["Cross", "crosses"],
                ["Index", "indices"]].forEach(function(param){
                it("should use correct plural form for " + param[0], function(){
                    var input = "   public List<"+ param[0] + "> ";
                    var result = getSuggestions(input);
                    expect(result).toContain(param[1]);
                });
            });
		});

		it("should contain typeName", function () {
			var input = data.WellKnownTextLine;
			var result = target.getParsingResult(input).typeName;
			expect(result).toBe(data.WellKnownInterface);
		});
	});
});