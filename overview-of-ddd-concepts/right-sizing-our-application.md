# Sizing

| One...                     | ...represents?                                                  |
| -------------------------- | --------------------------------------------------------------- |
| Microservice               | No more than 1 bounded context                                  |
| Git repository (mono-repo) | 1 microservice (composed of 1 or more functions etc.)           |
| Lambda function            | 1 "feature" (aggregate, use case...)                            |
| API Gateway                | The usecase/business-oriented entrypoint to the bounded context |

See: https://serverlessfirst.com/setting-boundaries/

> Evans believes that microservices is the biggest opportunity, but also the biggest risk we have had for a long time. What we should be most interested in is the capabilities they give us to fulfil the needs of the business we are working with, but he also warns against the bandwagon effect. One problem he sees is that many believe that a microservice is a bounded context, but he thinks that’s an oversimplification. He instead sees four kinds of contexts involving microservices.

1. `Service Internal` ("Using only this type, we would end up with services that don’t know how to talk to each other")
2. `API of Service` ("One challenge here is how teams design and adapt to different APIs. Data-flow direction could determine development dependency with consumers always conforming to an upstream data flow, but Evans think there are alternatives")
3. `Cluster of codesigned services` ("When several services are designed to work with each other to accomplish something, they together form a bounded context. Evans notes that the internals of the individual services can be quite different with models different from the model used in the API")
4. `Interchange Context` ("There are no services in this context; it’s all about messages, schemas and protocols")

See: https://www.infoq.com/news/2019/06/bounded-context-eric-evans/

### Use cases

```
In Clean Architecture, Uncle Bob describes use cases as the main features of the application.

These are all the things our application can do.

And in a previous article, we discovered that use cases were either commands or queries.
```

##
