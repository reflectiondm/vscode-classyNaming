# Change Log

## [1.2.0]
- Added smarter casing for suggestions of public fields/properties names:

examples:
``` csharp
class TestClass
{
    public IList<MyType>          // suggests [ 'myTypes', 'MyTypes', 'types', 'Types' ]
    private readonly IMyService   // suggests [ 'myService', '_myService', 'service', '_service' ]
    Enumerable<User> _            // suggests [ '_users', 'users' ]
    Enumerable<User> u            // suggests [ 'users', 'Users' ]
    Enumerable<User> U            // suggests [ 'Users', 'users' ]
}
```
Thanks [Orion Kindel](https://github.com/cakekindel) for this great contribution.

## [1.1.1]
- Fix interfering with the default suggestions from vscode. Now all default suggestions should still be in place

