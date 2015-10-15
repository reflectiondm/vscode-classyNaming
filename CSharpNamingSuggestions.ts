import * as vscode from 'vscode'
import * as csharp from './csharpParser'

export let modeId: string = 'csharp';

export class SuggestSupport implements vscode.Modes.ISuggestSupport {

	private parser :csharp.CsharpParser = new csharp.CsharpParser();
	
	public triggerCharacters: string[] = [' ', "."];
	public excludeTokens: string[];
	public sortBy: vscode.Modes.ISortingTypeAndSeparator[] = [{
		type:  "aType"
	}];
	public suggest(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
		console.log('Entered suggest method');
		
		//TODO: Write a testcase for it
		var start = new vscode.Position(position.line, 0);
		var range = new vscode.Range(start, position);
		var text = document.getTextInRange(range);
		
		console.log('Got the following text from document: ' + text);
		
		var type = this.parser.extractType(text);
		var variants = this.parser.splitTypeName(type);
		
		var variant = variants[0][0].toLowerCase() + variants[0].substring(1);
		let suggestion: vscode.Modes.ISuggestion = {
			label: variant,
			codeSnippet: variant,
			type: "aType",
			typeLabel: 'this is type'
		};

		let result: vscode.Modes.ISuggestions = {
			currentWord: 'current word',
			suggestions: [suggestion],
			overwriteBefore: 0,
			overwriteAfter: 0
		}
		
		console.log('Result is: ' + result.suggestions[0].label);
		return Promise.resolve([
			result
		])
	};
};