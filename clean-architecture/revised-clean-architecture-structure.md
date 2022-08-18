# Revised Clean Architecture structure

TODO

![From Robert C. Martin's blog. "The Clean Architecture", 10 August 2012.
https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](../.gitbook/assets/CleanArchitecture.jpg)

The intention with all of these ideas for how to structure an application are all well-meaning, but I've also see and reflected on how a higher level of "layers" or "circles" can complicate things quite quickly.

Let's at least look at the levels.

## How the concepts/levels map across DDD, CA, and our project

Let's also make it clear that there is very little about the practicalities of code or folder structure in Eric Evans' original book. Many have simply tried to infer the concepts and their ordering into models that work for them.

For me part, I've found that Robert C. Martin's "clean architecture" is a better (and simpler!) elaboration of where so many developers have tried to find a way. It's not magic, just a very nice mapping (and blog article, and book for that matter!).

| DDD  | Clean Architecture                            | Mikael                                   |
| ---- | --------------------------------------------- | ---------------------------------------- |
| asdf | Frameworks & Drivers (DB, Devices...)         | infrastructure/{relevant-directory-name} |
| asdf | Interface Adapters (Controllers, Gateways...) | infrastructure/adapters                  |
| asdf | Application Business Rules (Use Cases)        | application                              |
| asdf | Enterprise Business Rules (Entities)          | domain                                   |

## Infrastructure

The "grown up" way to think about infrastructure is that they are generic functions, classes and objects that help set up non-domain-related functionality. Good examples of this include repositories, very generic utility functions, Lambda event handlers (the outer layer), and anything else that has no (or very little) unique value in the specific context.

I've been totally happy with not using Clean Architecture's "frameworks and drivers" nomenclature here, but keeping it very flat and simple instead. Those terms didn't really stick with me or become communicated very well. It's fine that frameworks and drivers are _part_ of the infrastructure, but I've personally abandoned packaging under that name.

For me, a useful heuristic has been "Can I move this thing without making essentially no changes and still get it working?". That does however maybe also say something about the desired level of quality, too...&#x20;

## Application

In the application layer we put anything that is not core to the business, but which _does have_ unique value. This should be the first layer where something "new" happens while all the code running before this layer could theoretically be basic boilerplate.&#x20;

## Domain

Now for the crème de la crème, the secret sauce, and [the figurative room where the magic happens](https://www.urbandictionary.com/define.php?term=this%20is%20where%20the%20magic%20happens). This is, as expected, where all the snazzy unique business logic and domain-orientation truly happens.

## Interfaces

This collects the types and interfaces. The reason I set this as a root-level item is so that we can effectively do things like:

* Exclude the folder when rendering dependencies
* Put them in the least nested and separate part of the overall structure, as practically every file will have to use some interface or another

