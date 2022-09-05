---
description: The battle plan for our technical infrastructure.
---

# Deciding on a Cloud Architecture

<figure><img src="../../.gitbook/assets/undraw_Cloud_docs_re_xjht.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

## Going serverless-first

Without being a one-sided advertisement I will still take a few moments to lay out a technical strategy based around [serverless](https://www.ibm.com/cloud/learn/serverless). I find that in most cases, given that we can make a technical choice early in the process, that it's smart to optimize (as, and if, possible) towards serverless services.

Some of the well-known benefits of serverless include:

* **Cost-efficiency**, as serverless services can "scale to zero" meaning they cost nothing if no one uses the resources.
* **Less management, maintenance, and toil** since the cloud service provider handles the majority of these parts.
* **Easier to focus on innovation** since the skills requirement for proper implementation is lower than doing the whole shebang on your own.
* **Makes it easier to adopt modern architecture patterns** like event-driven architecture and microservices because you are essentially forced (well, it just makes a lot more sense) to use API gateways, event buses or topics, and short-lived functions to wire up your solution.

{% hint style="warning" %}
As always there are trade-offs. The most basic ones relate to serverless typically offering fewer configuration options, which _may_ be a deal-breaker in some scenarios, and that serverless products indeed become more "black-boxed" and tied to the particular vendor.

Dare to question your assumptions on your needs for the above. You'll probably find that you win a lot more than you lose.
{% endhint %}

One of my favorite examples of unwanted complexity comes from Yan Cui when trying to answer the oft-mentioned statement "[even simple serverless applications have complex architecture diagrams](https://medium.com/theburningmonk-com/even-simple-serverless-applications-have-complex-architecture-diagrams-so-what-8dc618fd4df6)". He addresses this perception as a kind of falsity, since it has been very common for developers and architects to conflate the logical (business) and physical (infrastructure) views or diagrams of systems, in which case a classical web server hosted on EC2 would look remarkably straightforward, while a Lambda-based microservice solution can quickly start looking rather intimidating.

> **Ask yourself what’s more important—having a simple-looking diagram of your application, or actually having a simpler application.**
>
> Because a serverless application might look more complex on paper than its serverful counterpart, but only one of these diagrams is a true representation of what you are running in your AWS account. And only one of these diagrams will give you a nasty surprise when you dare to open the box and see what’s inside.

In the spirit of serverless and purpose-oriented functions, the diagram of a serverless solution will much more likely be "[screaming architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)" than an old-school deployment diagram of some network and a virtual machine. A benefit of serverless is that **the diagram itself helps to actually outline what the logical functionality is**, since we can be more expressive and fine-grained with resource usage, for example:

* Dedicated functions for unique business use-cases;
* Logically separated databases for different information objects or entities;
* Topics or event buses that are solely dedicated to handle the needs of individual functions.

Ergo, the quantity of cloud resources will indeed grow, but it can also (correctly used) be 100% truthful of what the system performs, rather than the classic 1-4 boxes of "magic providence" that _does all of it_.&#x20;

## Databases

Our use case does not have a strict need for extensive relational mappings, so we can be broader in our selection and it's practically fine going with a non-relational solution.

The ideal serverless database option on AWS is [DynamoDB](https://aws.amazon.com/dynamodb/), a database that dates back to 2012 and which has gained additional features throughout the years. It's extremely fast and scalable, has a stellar reputation and historical performance, but will require a somewhat different mindset when being used.

While there is also [AWS Aurora](https://aws.amazon.com/rds/aurora/) on the relational spectrum of things, there just does not exist really good relational solutions that are optimized for the cloud that are turn-key the way we expect of serverless.

{% hint style="info" %}
Some excellent resources on DynamoDB include:

* [The DynamoDB Guide](https://www.dynamodbguide.com/what-is-dynamo-db)
* [Single-table vs. multi-table design in Amazon DynamoDB](https://aws.amazon.com/blogs/database/single-table-vs-multi-table-design-in-amazon-dynamodb/)
* [The What, Why, and When of Single-Table Design with DynamoDB](https://www.alexdebrie.com/posts/dynamodb-single-table/)
* [Fundamentals of Amazon DynamoDB Single Table Design with Rick Houlihan](https://www.youtube.com/watch?v=KYy8X8t4MB8)
{% endhint %}

## Compute

Once again, looking at the high level requirements we want something that can run in response to events and in response to REST API calls. We have no reason to believe it should need to handle long runs, massive amounts of memory, or complex calculations.

The undisputed king of serverless compute platforms has been AWS [Lambda](https://aws.amazon.com/lambda/) for quite some years now—That's the same platform we will use here. It satisfies all the conditions mentioned above, and is possible to use in a number of languages/runtimes, including TypeScript.

NOTE  “Workflow-oriented solutions (single purpose utility functions) vs conventional entity-oriented APIs/systems and everything in between”

## Eventing

We need to be able to send (publish) and respond to (subscribe) events.

The classical choice here would have been AWS Simple Notification Service (SNS). It's a push-based service meaning getting something to react to an event is taken care of automatically and (more or less) directly.

An optional way of doing this could have been using AWS Managed Streaming for Apache Kafka (MSK). It's poll-based so you have to "ask for" data at intervals to see if something has happened.

In our case, we will instead opt for AWS EventBridge. It offers a similar type of product as SNS, but offers a more convenient developer experience, better event support (such as event catalogs, event archives and retries, and event discovery) and possibility to use more types of subscribers (such as Lambda, SNS, SQS, and API Gateway). Overall it's a more evolved fit from the more "basic" but still powerful SNS.

From a capability perspective we might have considered SNS closer if we had very stringent needs around event ordering, exactly-once delivery, or very high topic count.

For more reading, please consider checking out this [comparison article by StateFarm](https://engineering.statefarm.com/blog/comparison-of-aws-services-for-event-driven-architecture/).

## API

The de facto standard in the modern cloud is that you leverage the native API products to front your applications rather than building something on your own with the likes of Express, Fastify, or Kong.

The API gateway will be the public interface connected to our other infrastructure, most importantly our Lambda compute functions which will respond on paths that we have defined.

In the case of AWS the service we are interested in is unsurprisingly called "API Gateway".

### Is there an option?

It's a bit of a theoretical digressing to wander down the path of asking oneself "but COULD I set up another API gateway solution"? In short the answer is yes, but then you would most likely (and most effectively) do it in a persistent virtual machine, which is not very serverless. So, yes, you could do it. But no, we won't. While it does hurt me to write it, this is one of the integration parts that you should leverage maximally when committing to a cloud service provider. Only if you were absolutely sure that you want an open source or multi-cloud solution should you practically consider this option.

### Choosing the type of API Gateway

One of the configuration questions we can look at has to do with which type of API Gateway we want. The traditional one is called "REST API" and the newer, lighter-weight one that came out in 2019 is named "HTTP API". All of this is probably somewhat confusing, and you would not be the first one to feel so. These are sometimes also called "v1" (REST API) and "v2" (HTTP API) API Gateways which at least for me makes a lot more sense. Do note that both of these work just fine with actual HTTP(S) and REST; in fact the naming is just plain bonkers.

Some of the additional features of v1 includes:

* AWS X-Ray tracing
* API keys support and per-client throttling
* Caching
* Request validation
* Edge-optimized endpoints

There are certainly benefits by going with the HTTP API as well, for example:

* Much cheaper to run
* They actually do support many (most?) features of v1
* Includes exclusive support for JWT authorization directly on the Gateway (v1 has to use a Lambda authorizer to do the same)
* Has exclusive support for certain integrations

_Read more at_ [_https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html_](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)_._

From a non-functional requirements perspective, the items listed in the REST API benefits are things we absolutely want to use, and since price effectively is not a real concern at this small scale, that argument becomes moot.

## Security

As noted in the API section, there exists a few security aspects that we need to keep in mind.

We don't want to double-down on security here, but we need to stay mindful of malicious usage.

Ways we want to mitigate such is:

* Limit scaling and provide a maximum provisioned surface for APIs etc so we cannot get "denial-by-wallet" attacks
* Use authorization mechanisms, even something simple like an API key
* Use CORS to restrain domains that may call the services
