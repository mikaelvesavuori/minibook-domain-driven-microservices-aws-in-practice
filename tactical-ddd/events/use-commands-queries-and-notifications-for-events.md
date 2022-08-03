# Use Commands, Queries and Notifications for events

### Use only Commands, Queries and Notifications for events <a href="#use-only-commands-queries-and-notifications-for-events" id="use-only-commands-queries-and-notifications-for-events"></a>

This principle also relates very much to other types of API.

We must separate our events (and ideally also API calls) into either the category of Command, Query or Notification, in line with how the [command-query separation](https://en.wikipedia.org/wiki/Command%E2%80%93query\_separation) concept and event notifications work:

> It states that every method should either be a **command** that performs an action, or a **query** that returns data to the caller, but not both. In other words, asking a question should not change the answer. More formally, methods should return a value only if they are referentially transparent and hence possess no side effects.

A Command in the context of events could be `RemoveStockItem`.

An example of a Query event would be `GetStockStateForItem`. You may recognize this from how even a classic REST API would work, though in that case using an endpoint. Because events are asynchronous, the system design for reading back data through events is by default somewhat complicated, as another surface to do the reading must be introduced. This is to say that _the event itself will not carry back the data_, instead the event will produce (for example) an update in the related data store that may be read back consistently.

This pattern may evolve into full-blown CQRS. See more at [![](https://docs.microsoft.com/favicon.ico)CQRS pattern - Azure Architecture Center](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs).

On top of _Commands_ and _Queries_ we have _Notifications_, which is what most people will understood events to be about. A notification is the conceptually simplest one, as it only represents that something happened, think `StockItemRemoved`.
