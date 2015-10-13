import * as vscode from 'vscode'

export let modeId: string = 'csharp';

export class SuggestSupport implements vscode.Modes.ISuggestSupport {
	public triggerCharacters: string[] = ['prop'];
	public excludeTokens: string[];
	public suggest(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
		console.log('Entered suggest method');
		var text = document.getTextOnLine(position.line);
		var words = text.substring(0, position.character).split(' ');

		let suggestion: vscode.Modes.ISuggestion = {
			label: 'create property template',
			codeSnippet: 'public string YourProperty { get; set; }',
			type: 'this is type'
		};

		let suggestion2: vscode.Modes.ISuggestion = {
			label: 'this is another label',
			codeSnippet: 'this is code snippet number 2',
			type: 'this is type'
		};

		let result: vscode.Modes.ISuggestions = {
			currentWord: 'current word',
			suggestions: [suggestion, suggestion2],
		}
		return Promise.resolve([
			result
		])
	}
};