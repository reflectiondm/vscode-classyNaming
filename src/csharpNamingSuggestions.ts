import * as vscode from "vscode";
import { CsharpParser } from "./csharpParser";

export default class SuggestSupport implements vscode.CompletionItemProvider {

    private parser: CsharpParser = new CsharpParser();

    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {
        //TODO: Write a testcase for it
        const start = new vscode.Position(position.line, 0);
        const range = new vscode.Range(start, position);
        const text = document.getText(range);
        // console.log(`parsing: ${text}`);
        const parsingResult = this.parser.getParsingResult(text);
        const type = parsingResult.typeName;
        const overwriteBefore = parsingResult.userInput.length;
        const suggestions = parsingResult.suggestions.map((v) => this.toSuggestion(v, type));

        return Promise.resolve(suggestions);
    };

    private toSuggestion(variant: string, type: string): vscode.CompletionItem {
        let result = new vscode.CompletionItem(variant);
        result.detail = type;
        return result;
    }
};
