/// <reference path="../typings/tsd.d.ts" />
var SuggestSupport = require('../out/csharpNamingSuggestions').SuggestSupport;

describe("SuggestSupport provides variable name based on a type name", function () {
	var target = new SuggestSupport();
	var getDocument = function (text) {
		return {
			getTextOnLine: function (n) { return text; }
		}
	};
	var position = {
		line: 5
	};
	var token = {};
	beforeEach(function () {
		position.line = 5
		token = {};
	});

	it("should suggest at least one name based on variable type", function (done) {
		var document = getDocument("public Provider ");
		target.suggest(document, position, token).then(function (res) {
			expect(res[0].suggestions[0].label).toContain("provider");
			done();
		})
	});
});