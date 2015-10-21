import * as vscode from "vscode";
import * as parser from "./csharpParser";

export class csharpQuickFixSupport implements vscode.Modes.IQuickFixSupport {
	private parser = new parser.CsharpParser();
	public getQuickFixes(document: vscode.TextDocument, marker: vscode.Range, token: vscode.CancellationToken) { 
		var memberRange = document.getWordRangeAtPosition(marker.start);
		var quickFixMember = document.getTextInRange(memberRange);
		var memberDeclaration = document.getTextInRange(new vscode.Range(new vscode.Position(marker.start.line, 1), memberRange.start));
		var suggestions = this.parser.getSuggestions(memberDeclaration);
		var result = suggestions.map(this.toQuickFix);
		return Promise.resolve(result);
	}

	public runQuickFixAction(resource: vscode.TextDocument, range: vscode.Range, id: any, token: vscode.CancellationToken) { 
		var wordRange = resource.getWordRangeAtPosition(range.start);
		var newText = id as string;
		return Promise.resolve({
			edits:[
				{resource: resource.getUri(),
					range: wordRange,
				newText: newText}
			]
		});
	}

	private toQuickFix(suggestion: string) : vscode.Modes.IQuickFix{
		return {
			label: suggestion,
			id: suggestion,
			documentation: "Rename to " + suggestion,
			score: 5
		};
	}
}