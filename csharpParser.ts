export class CsharpParser {
	public extractType(input: string) {
		var sanitize = input.trim();
		var result = '';
		for (var i = sanitize.length - 1; i > 0; i--) {
			if (this.isMemberSeparator(sanitize[i])) {
				result = sanitize.substring(i + 1);
				break;
			}
		}
		return result;
	}
	
	private isMemberSeparator(c:string):boolean{
		return 	c == '(' 
				|| c == ' ';
	}
}