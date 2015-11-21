[![Build Status](https://travis-ci.org/reflectiondm/vscode-classyNaming.svg)](https://travis-ci.org/reflectiondm/vscode-classyNaming)
[![bitHound Score](https://www.bithound.io/github/reflectiondm/vscode-classyNaming/badges/score.svg)](https://www.bithound.io/github/reflectiondm/vscode-classyNaming)

# Classy Naming
> Provides suggestions for field and parameter names for C#

## What is it for? 
Just look at that code:
```csharp
public class BandDataProcessor
{
	private readonly IBandDataProvier _dataProvider;
	private readonly IBandFromatter _formatter;
	private readonly BandParser _bandParser;
	
	public BandDataProcessor(IBandDataProvier dataProvider, 
		IBandFromatter formatter, 
		BandParser bandParser)
	{
		...
	}
}
```

Looks familiar, right? We all tend to stick to pretty much same naming 
conventions and tend to name parameters or fields after the types they 
represent. While your IDE (and VS Code does it for sure) will suggest 
you the type name after a few keystrokes, you normally have to type in
the name from the begining to the end. How fun can that be? No fun at all.

*ClassyNaming* is there to save you from dying of boredom when naming your fields.
Just start typing a variable name or activate an IntellySense by a keyboard shortcut and it will suggest you the most obvious options
to chose from!

## See how it works
![](https://github.com/reflectiondm/vscode-classyNaming/raw/master/assets/preview.gif)

---------------
## License
MIT © [Andrei Zubov](https://github.com/reflectiondm)
