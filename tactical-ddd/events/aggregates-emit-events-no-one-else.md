# Aggregates emit events, no one else



Only aggregates must emit events since they enforce business rules. In practice this should be done post-fact as a result of an operation, for example like:

1. User makes a request to our system/service (“aggregate”)
2. Our system instantiates a class for our aggregate and fulfils the operation (if valid)
3. Our system emits an event to notify that the operation has occurred

From [![](https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196)DDD: Handle domain events directly in aggregate?](https://stackoverflow.com/a/67309855) :

> An aggregate has the responsibility of maintaining the [invariants](https://domaincentric.net/blog/modelling-business-rules-invariants-vs-corrective-policies) required by the business logic (e.g. limits on how many pallets are in a given location or a prohibition on pallets containing certain items from being placed in a given location).
>
> However, a domain event represents a fact about the world which the aggregate cannot deny (an aggregate could ignore events if they have no meaning to it (which is not a question of validation, but of the type of event: the aggregate's current state cannot enter into it)). If an aggregate handles domain events, it therefore should do so unconditionally: if the business rule the location aggregate enforces is that there cannot be more than 20 pallets in a location, then a domain event which effectively leads to there being 20 thousand pallets in a location means that you have 20 thousand pallets in that location.

See:

* [https://www.jamesmichaelhickey.com/domain-driven-design-aggregates/](https://www.jamesmichaelhickey.com/domain-driven-design-aggregates/)
* [![](https://martinfowler.com/favicon.ico)bliki: DDD\_Aggregate](https://martinfowler.com/bliki/DDD\_Aggregate.html)
* [![](https://img.alicdn.com/tfs/TB1ugg7M9zqK1RjSZPxXXc4tVXa-32-32.png)An In-Depth Understanding of Aggregation in Domain-Driven Design](https://www.alibabacloud.com/blog/an-in-depth-understanding-of-aggregation-in-domain-driven-design\_598034)
* [![](https://cdn.sstatic.net/Sites/softwareengineering/Img/favicon.ico?v=c4f35a1e3900)Can an aggregate only ever consume commands and produce events?](https://softwareengineering.stackexchange.com/questions/368358/can-an-aggregate-only-ever-consume-commands-and-produce-events)

## Persisting events

TODO: CQRS, Event Sourcing

Before emitting our events, we can store them in our DynamoDB table.

## Resiliency

The code base uses a trivial handwavy way to set up a Dead Letter Queue (often just abbreviated as DLQ). A full implementation would for example implement a Lambda function that just re-emits the event on the appropriate bus. This could theoretically become mined territory since we want to keep a tight ship regarding who can emit what event to which bus. In this case we can only use a single Lambda to do that work and it must not contain any business functionality—only re-emit the exact same event!

This is left to you as an optional exercise should you want to do this.

See:

* [https://serverlessland.com/blog/building-resilient-serverless-patterns-by-combining-messaging-services--aws-compute-blog](https://serverlessland.com/blog/building-resilient-serverless-patterns-by-combining-messaging-services--aws-compute-blog)
* [https://aws.amazon.com/blogs/compute/improved-failure-recovery-for-amazon-eventbridge/](https://aws.amazon.com/blogs/compute/improved-failure-recovery-for-amazon-eventbridge/)
* [https://www.youtube.com/watch?v=I6cXfiMkh-U](https://www.youtube.com/watch?v=I6cXfiMkh-U)
* [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-queuename](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-queuename)
* [https://www.serverless.com/framework/docs/providers/aws/events/event-bridge](https://www.serverless.com/framework/docs/providers/aws/events/event-bridge)
