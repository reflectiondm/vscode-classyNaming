import * as vscode from "vscode";
import * as csharp from "./csharpParser";

export let modeId: string = "csharp";

export class SuggestSupport implements vscode.CompletionItemProvider {

    private parser: csharp.CsharpParser = new csharp.CsharpParser();

    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {
        //TODO: Write a testcase for it
        let start = new vscode.Position(position.line, 0);
        let range = new vscode.Range(start, position);
        let text = document.getText(range);

        let parsingResult = this.parser.getParsingResult(text);
        let type = parsingResult.typeName;
        let overwriteBefore = parsingResult.userInput.length;
        let suggestions = parsingResult.suggestions.map((v) => this.toSuggestion(v, type));

        return Promise.resolve(suggestions);
    };

    private toSuggestion(variant: string, type: string): vscode.CompletionItem {
        let result = new vscode.CompletionItem(variant);
        result.detail = type;
        return result;
    }
};