# Setting boundaries

```
Now we're ready to go from domain model to application design. Here's an approach that you can use to derive microservices from the domain model.

1. Start with a bounded context. In general, the functionality in a microservice should not span more than one bounded context. By definition, a bounded context marks the boundary of a particular domain model. If you find that a microservice mixes different domain models together, that's a sign that you may need to go back and refine your domain analysis.

2. Next, look at the aggregates in your domain model. Aggregates are often good candidates for microservices. A well-designed aggregate exhibits many of the characteristics of a well-designed microservice, such as:
- An aggregate is derived from business requirements, rather than technical concerns such as data access or messaging.
- An aggregate should have high functional cohesion.
- An aggregate is a boundary of persistence.
- Aggregates should be loosely coupled.

3. Domain services are also good candidates for microservices. Domain services are stateless operations across multiple aggregates. A typical example is a workflow that involves several microservices. We'll see an example of this in the Drone Delivery application.

4. Finally, consider non-functional requirements. Look at factors such as team size, data types, technologies, scalability requirements, availability requirements, and security requirements. These factors may lead you to further decompose a microservice into two or more smaller services, or do the opposite and combine several microservices into one.

After you identify the microservices in your application, validate your design against the following criteria:
- Each service has a single responsibility.
- There are no chatty calls between services. If splitting functionality into two services causes them to be overly chatty, it may be a symptom that these functions belong in the same service.
- Each service is small enough that it can be built by a small team working independently.
- There are no inter-dependencies that will require two or more services to be deployed in lock-step. It should always be possible to deploy a service without redeploying any other services.
- Services are not tightly coupled, and can evolve independently.
- Your service boundaries will not create problems with data consistency or integrity. Sometimes it's important to maintain data consistency by putting functionality into a single microservice.
That said, consider whether you really need strong consistency. There are strategies for addressing eventual consistency in a distributed system, and the benefits of decomposing services often outweigh the challenges of managing eventual consistency.
```

See: https://docs.microsoft.com/en-us/azure/architecture/microservices/model/microservice-boundaries

## Right-sizing our application



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

## Subdomain or bounded context?



> One confusion that Evans sometimes notices in teams is differentiating between bounded contexts and subdomains. In an ideal world they coincide, but in reality they are often misaligned. He uses an example of a bank structured around cash accounts and credit cards. These two subdomains in the banking domain are also bounded contexts. After reorganising the business around business accounts and personal accounts, there are now two other subdomains, but the bounded contexts stay the same, which means they are now misaligned with the new subdomains. This often results in two teams having to work in the same bounded contexts with an increasing risk of ending up with a big ball of mud.

See: https://www.infoq.com/news/2019/06/bounded-context-eric-evans/

## Practice

![](<../../.gitbook/assets/Get-A-Room Context Map.png>)

##
