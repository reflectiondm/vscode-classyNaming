// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 
import * as csharp from './csharpNamingSuggestions';
// import * as csharpQuickFix from './csharpQuickFixSupport';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate() { 
	
	var cSharpSuggestSupport = new csharp.SuggestSupport();
	// var quickFixSupport = new csharpQuickFix.csharpQuickFixSupport();
	// Register C# naming suggestion support	
	// vscode.Modes.SuggestSupport.register(csharp.modeId, cSharpSuggestSupport);
	vscode.languages.registerCompletionItemProvider(csharp.modeId, cSharpSuggestSupport, []);
	// vscode.Modes.QuickFixSupport.register(csharp.modeId, quickFixSupport);
}