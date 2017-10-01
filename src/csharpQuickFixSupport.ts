import * as vscode from "vscode";
import * as parser from "./csharpParser";

export class CSharpQuickFixSupport implements vscode.CodeActionProvider {
    private parser = new parser.CsharpParser();

    public provideCodeActions(document: vscode.TextDocument, marker: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken) {
        const memberRange = document.getWordRangeAtPosition(marker.start);
        const quickFixMember = document.getText(memberRange);
        const memberDeclaration = document.getText(new vscode.Range(new vscode.Position(marker.start.line, 1), memberRange.start));
        const suggestions = this.parser.getParsingResult(memberDeclaration).suggestions;
        const result = suggestions.map(this.toQuickFix);
        return Promise.resolve(result);
    }

    // public runQuickFixAction(resource: vscode.TextDocument, range: vscode.Range, id: any, token: vscode.CancellationToken) {
    // 	var wordRange = resource.getWordRangeAtPosition(range.start);
    // 	var newText = id as string;
    // 	return Promise.resolve({
    // 		edits:[
    // 			{resource: resource.getUri(),
    // 				range: wordRange,
    // 			newText: newText}
    // 		]
    // 	});
    // }

    private toQuickFix(suggestion: string): vscode.Command {
        return {
            title: suggestion,
            command: "renameSuggestion",
            arguments: [suggestion],
        };
    }
}
