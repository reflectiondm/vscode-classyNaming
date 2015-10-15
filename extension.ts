// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 
import * as csharp from './CSharpNamingSuggestions'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate() { 
	
	var cSharpSuggestSupport = new csharp.SuggestSupport();
	
	// Register C# naming suggestion support	
	vscode.Modes.SuggestSupport.register(csharp.modeId, cSharpSuggestSupport);
}