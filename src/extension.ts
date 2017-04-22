import * as vscode from "vscode";
import SuggestSupport from "./csharpNamingSuggestions";

import { getCharacters, concat } from "./utils";

const modeId: string = "csharp";

// this method is called when your extension is activated
export function activate() {
    const cSharpSuggestSupport = new SuggestSupport();
    const triggerCharactes = concat(
        [" ", "_"],
        getCharacters("A", "Z"),
        getCharacters("a", "z"),
        getCharacters("0", "9")
    );
    // Register C# naming suggestion support
    vscode.languages.registerCompletionItemProvider(modeId, cSharpSuggestSupport, ...triggerCharactes);
}
