import * as vscode from "vscode";
import SuggestSupport from "./csharpNamingSuggestions";

const modeId: string = "csharp";

// this method is called when your extension is activated
export function activate() {
    const cSharpSuggestSupport = new SuggestSupport();
    // Register C# naming suggestion support	
    vscode.languages.registerCompletionItemProvider(modeId, cSharpSuggestSupport);
}
