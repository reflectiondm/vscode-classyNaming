import * as vscode from "vscode";
import * as csharp from "./csharpParser";

export let modeId: string = "csharp";

export class SuggestSupport implements vscode.Modes.ISuggestSupport {

	private parser: csharp.CsharpParser = new csharp.CsharpParser();

	public triggerCharacters: string[] = ["_", " "];
	public excludeTokens: string[] = [];
	public sortBy: vscode.Modes.ISortingTypeAndSeparator[] = [{
		type: "aType"
	}];
	public suggest(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
		//TODO: Write a testcase for it
		var start = new vscode.Position(position.line, 0);
		var range = new vscode.Range(start, position);
		var text = document.getTextInRange(range);

		var parsingResult = this.parser.getParsingResult(text);
		var type = parsingResult.typeName;
		var overwriteBefore = parsingResult.userInput.length;
		var suggestions = parsingResult.suggestions.map((v) => this.toSuggestion(v, type));

		let result: vscode.Modes.ISuggestions = {
			currentWord: "current word",
			suggestions: suggestions,
			overwriteBefore: overwriteBefore,
			overwriteAfter: 0
		};

		console.log("Result is: " + result.suggestions[0].label);
		return Promise.resolve([
			result
		]);
	};

	private toSuggestion(variant: string, type: string): vscode.Modes.ISuggestion {
		return {
			label: variant,
			codeSnippet: variant,
			type: "aType",
			typeLabel: type
		};
	}
};