import * as vscode from "vscode";
import * as csharp from "./csharpParser";

export let modeId: string = "csharp";

export class SuggestSupport implements vscode.CompletionItemProvider {

	private parser: csharp.CsharpParser = new csharp.CsharpParser();

	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) : Thenable<vscode.CompletionItem[]> {
		//TODO: Write a testcase for it
		var start = new vscode.Position(position.line, 0);
		var range = new vscode.Range(start, position);
		var text = document.getText(range);

		var parsingResult = this.parser.getParsingResult(text);
		var type = parsingResult.typeName;
		var overwriteBefore = parsingResult.userInput.length;
		var suggestions = parsingResult.suggestions.map((v) => this.toSuggestion(v, type));

		return Promise.resolve(suggestions);
	};

	private toSuggestion(variant: string, type: string): vscode.CompletionItem {
		var result = new vscode.CompletionItem(variant); 
		result.detail = type;
		return result;
	}
};