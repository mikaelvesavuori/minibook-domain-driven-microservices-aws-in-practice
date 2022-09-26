---
description: >-
  It's not fun to say "no" but without saying "no" there is no control we can
  exert over our domain landscape. Boundaries are the DDD way of including or
  excluding something in a context.
---

# Setting boundaries

<figure><img src="../.gitbook/assets/undraw_circles_y7s2.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

While the ubiquitous language might be the most pervasive and influential tool in the strategic DDD toolbox, I'd say that **the defining of bounded contexts remains the most powerful tool**. Language makes us define the concepts in play, as well as what (and how) they represent something. Setting boundaries on contexts, on the other hand, carves out the landscape, pointing out where responsibilities lay.

## Core principles

{% hint style="info" %}
I will adapt some of the great points made in [https://learn.microsoft.com/en-us/azure/architecture/microservices/model/microservice-boundaries](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/microservice-boundaries)
{% endhint %}

### Aggregates are shaped by business needs

asdf

### You can't split an Aggregate smaller than its cohesive entirety

asdf

### Aggregates don't depend on others

Consequently, services are completely independent of other services and aggregates.



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



<figure><img src="../.gitbook/assets/Get-A-Room Context Map 1.png" alt=""><figcaption><p>Diagram with only contexts</p></figcaption></figure>

TODO

## Right-sizing our application

TODO

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

<figure><img src="../.gitbook/assets/Get-A-Room Context Map 2.png" alt=""><figcaption><p>Diagram with only contexts + (sub)domain etc</p></figcaption></figure>

TODO

## Context maps

TODO

![Complete with relations](<../.gitbook/assets/Get-A-Room Context Map.png>)

TODO
