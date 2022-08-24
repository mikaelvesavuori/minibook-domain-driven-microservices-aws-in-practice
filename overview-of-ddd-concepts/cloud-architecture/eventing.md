# Eventing

We need to be able to send (publish) and respond to (subscribe) events.

The classical choice here would have been AWS Simple Notification Service (SNS). It's a push-based service meaning getting something to react to an event is taken care of automatically and (more or less) directly.

An optional way of doing this could have been using AWS Managed Streaming for Apache Kafka (MSK). It's poll-based so you have to "ask for" data at intervals to see if something has happened.

In our case, we will instead opt for AWS EventBridge. It offers a similar type of product as SNS, but offers a more convenient developer experience, better event support (such as event catalogs, event archives and retries, and event discovery) and possibility to use more types of subscribers (such as Lambda, SNS, SQS, and API Gateway). Overall it's a more evolved fit from the more "basic" but still powerful SNS.

From a capability perspective we might have considered SNS closer if we had very stringent needs around event ordering, exactly-once delivery, or very high topic count.

For more reading, please consider checking out this [comparison article by StateFarm](https://engineering.statefarm.com/blog/comparison-of-aws-services-for-event-driven-architecture/).
