# Entities and aggregates

An _Entity_ is a potentially changeable object, which has a unique identifier. _Entities_ have a life of their own within their _Domain Model_, which enables you to obtain the entire transition history of this _Entity_.

It is one of the most important and complex patterns of _Tactical Design_, _Aggregates_ are based on two other _Tactical Standards_, which are _Entities_ and _Value Objects_. An _Aggregate_ is a Cluster of one or more _Entities_, and may also contain _Value Objects_. The Parent _Entity_ of this Cluster receives the name of _Aggregate Root_.

aggregate root is a consistency boundary

> An aggregate is a cluster of associated objects that we treat as a unit for the purpose of data changes.
>
> — Source: Eric Evans
