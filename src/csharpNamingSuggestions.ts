import { CompletionItemProvider, TextDocument, Position, CancellationToken, CompletionItem, Range, CompletionItemKind } from "vscode";
import { CsharpParser } from "./csharpParser";

export default class SuggestSupport implements CompletionItemProvider {

    private parser: CsharpParser = new CsharpParser();

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): CompletionItem[] {
        const start = new Position(position.line, 0);
        const range = new Range(start, position);
        const text = document.getText(range);
        console.log('parsing:', text);
        const parsingResult = this.parser.getParsingResult(text);
        const type = parsingResult.typeName;
        const suggestions = parsingResult.suggestions.map(toSuggestion);

        return suggestions;
    }
}

function toSuggestion(variant: string): CompletionItem {
    const result = new CompletionItem(variant);
    result.kind = CompletionItemKind.Variable;
    return result;
}
