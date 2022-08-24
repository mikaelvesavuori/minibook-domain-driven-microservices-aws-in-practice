# Tactical DDD

See [https://docs.microsoft.com/en-us/azure/architecture/microservices/model/tactical-ddd](https://docs.microsoft.com/en-us/azure/architecture/microservices/model/tactical-ddd)

From [https://thedomaindrivendesign.io/what-is-tactical-design/](https://thedomaindrivendesign.io/what-is-tactical-design/)

The _Tactical Design_ helps us create an elegant _Domain Model_ using _Building Blocks_, see below the main _Building Blocks_:

### Entities

An _Entity_ is a potentially changeable object, which has a unique identifier. _Entities_ have a life of their own within their _Domain Model_, which enables you to obtain the entire transition history of this _Entity_.

### Value Objects

What differentiates a _Value Object_ from an _Entity_ is that, _Value Objects_are immutable and do not have a unique identity, are defined only by the values of their attributes. The consequence of this immutability is that in order to update a _Value Object_, you must create a new instance to replace the old one.

### Aggregates

It is one of the most important and complex patterns of _Tactical Design_, _Aggregates_ are based on two other _Tactical Standards_, which are _Entities_ and _Value Objects_. An _Aggregate_ is a Cluster of one or more _Entities_, and may also contain _Value Objects_. The Parent _Entity_ of this Cluster receives the name of _Aggregate Root_.

### Services

_Services_ are stateless objects that perform some logic that do not fit with an operation on an _Entity_ or _Value Object_.\
They perform domain-specific operations, which can involve multiple domain objects.

### Repositories

_Repositories_ are mainly used to deal with storage, they abstract concerns about data storage. They are responsible for persisting _Aggregates_.

### Factories

_Factories_ are used to provide an abstraction in the construction of an Object, and can return an _Aggregate_ root, an _Entity_, or an _Value Object_. _Factories_ are an alternative for building objects that have complexity in building via the constructor method.

### Events

_Events_ indicate significant occurrences that have occurred in the domain and need to be reported to other stakeholders belonging to the domain. It is common for _Aggregates_ to publish events.

### Modules

_Modules_ are little mentioned by the developers, however, their use can be very interesting.\
Modules help us segregate concepts, can be defined as a _Java package_or a _C# namespace_, and always follow the _Ubiquitous Language_.



You need to understand that not all of these concepts need to be applied to your _Domain Model_, you need to do an analysis so that it does not add unnecessary complexity to your project.



This section describes key passages of the code and the overall implementation rather than rehashing the complete and rather extensive code base. The approach will be checking out and analyzing examples of patterns, especially for the tactical DDD concepts:

* Modules
* Services
* Repositories
* Factories
* Value objects
* Entities
* Aggregates
* Events

