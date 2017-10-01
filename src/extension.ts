import * as vscode from "vscode";
import SuggestSupport from "./csharpNamingSuggestions";

import { getCharacters, concat } from "./utils";

const modeId: string = "csharp";

// this method is called when your extension is activated
export function activate() {
    // Register C# naming suggestion support
    vscode.languages.registerCompletionItemProvider(modeId, new SuggestSupport());
    console.log('console is working');
}
