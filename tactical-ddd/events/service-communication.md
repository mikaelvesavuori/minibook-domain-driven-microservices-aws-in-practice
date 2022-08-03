# Service communication

```
The Lambda Pinball is a Serverless anti-pattern highlighted by ThoughtWorks, in which “we lose sight of important domain logic in the tangled web of lambdas, buckets and queues as requests bounce around increasingly complex graphs of cloud services.”

This is often the result of a lack of clear Service boundaries. Moving to an EDA and adopting EventBridge can help massively — but this is not a standalone silver bullet.

What is needed is a focus on Services, identifying clear Bounded Contexts (to borrow from Domain-Driven Design) and sharing Event Schemas, not code, API interfaces or Data.
```

See: https://medium.com/serverless-transformation/eventbridge-storming-how-to-build-state-of-the-art-event-driven-serverless-architectures-e07270d4dee

##
