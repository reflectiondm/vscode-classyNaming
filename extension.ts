import * as vscode from 'vscode'; 
import * as csharp from './csharpNamingSuggestions';
// this method is called when your extension is activated
export function activate() { 	
	var cSharpSuggestSupport = new csharp.SuggestSupport();
	// Register C# naming suggestion support	
	vscode.languages.registerCompletionItemProvider(csharp.modeId, cSharpSuggestSupport, ['_']);
}