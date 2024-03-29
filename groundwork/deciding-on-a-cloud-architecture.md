---
description: The battle plan for our technical infrastructure.
---

# Deciding on a Cloud Architecture

<figure><img src="../../.gitbook/assets/undraw_Cloud_docs_re_xjht.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

## Going serverless-first

Without being a one-sided advertisement I will still take a few moments to lay out a technical strategy based around [serverless](https://www.ibm.com/cloud/learn/serverless). I find that in most cases, given that we can make a technical choice early in the process, it's smart to optimize (as, and if, possible) serverless services.

Some of the well-known benefits of serverless include:

- **Cost-efficiency**, as serverless services can "scale to zero" meaning they cost nothing if no one uses the resources.
- **Less management, maintenance, and toil** since the cloud service provider handles the majority of these parts.
- **Easier to focus on innovation** since the skills required for proper implementation are lower than doing the whole shebang on your own.
- **Makes it easier to adopt modern architecture patterns** like event-driven architecture and microservices because you are essentially forced (well, it just makes a lot more sense) to use API gateways, event buses or topics, and short-lived functions to wire up your solution.

{% hint style="warning" %}
As always there are trade-offs. The most basic ones relate to serverless typically offering fewer configuration options, which _may_ be a deal-breaker in some scenarios, and that serverless products indeed become more "black-boxed" and tied to the particular vendor.

Dare to question your assumptions on your needs for the above. You'll probably find that you win a lot more than you lose.
{% endhint %}

One of my favorite examples of unwanted complexity comes from Yan Cui when trying to answer the oft-mentioned statement "[even simple serverless applications have complex architecture diagrams](https://medium.com/theburningmonk-com/even-simple-serverless-applications-have-complex-architecture-diagrams-so-what-8dc618fd4df6)". He addresses this perception as a kind of falsity since it has been very common for developers and architects to conflate the logical (business) and physical (infrastructure) views or diagrams of systems, in which case a classical web server hosted on EC2 would look remarkably straightforward, while a Lambda-based microservice solution can quickly start looking rather intimidating.

> **Ask yourself what’s more important—having a simple-looking diagram of your application, or actually having a simpler application.**
>
> Because a serverless application might look more complex on paper than its serverful counterpart, only one of these diagrams is a true representation of what you are running in your AWS account. And only one of these diagrams will give you a nasty surprise when you dare to open the box and see what’s inside.

In the spirit of serverless and purpose-oriented functions, the diagram of a serverless solution will much more likely be "[screaming architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)" than an old-school deployment diagram of some network and a virtual machine. A benefit of serverless is that **the diagram itself helps to actually outline what the logical functionality is**, since we can be more expressive and fine-grained with resource usage, for example:

- Dedicated functions for unique business use-cases;
- Logically separated databases for different information objects or Entities;
- Topics or event buses that are solely dedicated to handling the needs of individual functions.

Ergo, the number of cloud resources will indeed grow, but it can also (correctly used) be 100% truthful of what the system performs, rather than the classic 1-4 boxes of "magic providence" that _does all of it_.&#x20;

## Databases

Our use case does not have a strict need for extensive relational mappings, so we can be broader in our selection and it's practically fine going with a non-relational solution.

The ideal serverless database option on AWS is [DynamoDB](https://aws.amazon.com/dynamodb/), a database that dates back to 2012 and which has gained additional features throughout the years. It's extremely fast and scalable, and has a stellar reputation and historical performance, but will require a somewhat different mindset when being used.

While there is also [AWS Aurora](https://aws.amazon.com/rds/aurora/) on the relational spectrum of things, there just does not exist really good relational solutions that are optimized for the cloud that are turn-key the way we expect of serverless.

{% hint style="info" %}
DynamoDB is not your grandfather's database, and it will maybe be challenging to start with if you aren't already familiar with NoSQL-style databases.

Some excellent resources to read up on DynamoDB include:

- [The DynamoDB Guide](https://www.dynamodbguide.com/what-is-dynamo-db)
- [Single-table vs. multi-table design in Amazon DynamoDB](https://aws.amazon.com/blogs/database/single-table-vs-multi-table-design-in-amazon-dynamodb/)
- [The What, Why, and When of Single-Table Design with DynamoDB](https://www.alexdebrie.com/posts/dynamodb-single-table/)
- [Fundamentals of Amazon DynamoDB Single Table Design with Rick Houlihan](https://www.youtube.com/watch?v=KYy8X8t4MB8)
  {% endhint %}

## Compute

Once again, looking at the high-level requirements we want something that can run in response to asynchronous events and synchronous API calls. We have no reason to believe it should need to handle long runs, massive amounts of memory, or complex calculations.

The undisputed king of serverless compute platforms has been AWS [Lambda](https://aws.amazon.com/lambda/) for quite some years now—That's the same platform we will use here. It satisfies all the conditions mentioned above and is possible to use in a number of languages/runtimes, including TypeScript.

Other viable options could include some of the better-known container services, such as [ECS](https://aws.amazon.com/ecs/) or [Fargate](https://www.google.com/search?client=safari&rls=en&q=aws+fargate&ie=UTF-8&oe=UTF-8). These however require significantly more plumbing and configuration, plus require some type of containerization actually happening. With Lambda, such work is kept at a minimal level and using [Serverless Framework](https://www.serverless.com) we'll continue pushing down the work involved in for example packaging the application.

## Eventing

We need to be able to send (_publish_) and respond (_subscribe_) to events.

The classic choice here would have been [Simple Notification Service (SNS)](https://aws.amazon.com/sns/). It's a push-based service, meaning it automatically handles propagating the event to recipients. SNS uses a pay-per-use model and is essentially serverless as the only infrastructure you need is the SNS _topic_.

An optional way of doing this could have been using [Managed Streaming for Apache Kafka (MSK)](https://aws.amazon.com/msk/). MSK is poll-based, so instead, you have to "ask for" data at intervals to see if something has happened. It hasn't always been serverless, but nowadays an option has been provided. Nevertheless, MSK makes the most sense if you are already invested in the Kafka space.

In our case, we will opt for still another option: [EventBridge](https://aws.amazon.com/eventbridge/). It is superficially a similar type of product as SNS but offers a more convenient developer experience, better event support (such as event catalogs, event archives, and event discovery), better filtering, and the possibility to use more types of subscribers (such as Lambda, SNS, SQS, and API Gateway). Overall it's a more evolved fit from the more "basic" but still powerful SNS for our application-centric needs. The EventBridge construct is not a topic, but rather an _event bus_.

From a capability perspective, we might have considered SNS closer if we had very stringent needs around event ordering, exactly-once delivery, or the very high topic count.

{% hint style="info" %}
For more reading, please consider checking out this [comparison article by StateFarm](https://engineering.statefarm.com/blog/comparison-of-aws-services-for-event-driven-architecture/) or [this article by Ashish Patel](https://medium.com/awesome-cloud/aws-difference-between-amazon-eventbridge-and-amazon-sns-comparison-aws-eventbridge-vs-aws-sns-46708bf5313).
{% endhint %}

## API

The de facto standard in the modern cloud is that you leverage the native API products to expose your applications, rather than building something on your own with the likes of Express, Fastify, or Kong.

An API gateway acts as the only public interface connected to any other infrastructure, in our case, this would most importantly be our Lambda compute functions which will respond on paths that we have defined in the gateway.

In the case of AWS, the service we are interested in is, unsurprisingly, called [API Gateway](https://aws.amazon.com/api-gateway/).

### Is there an option?

It's a bit of a theoretical digression to wander down the path of asking oneself "But _could_ I set up another API gateway solution"? In short, the answer is "yes", but then you would most likely (and most effectively) do it in a persistent virtual machine, which is itself hardly serverless, now is it? So, yes, you could do it. But no, we won't.

The API gateway is one of the integration parts that you should leverage maximally when committing to a cloud service provider. Only if you were absolutely sure that you want an open source or multi-cloud solution should you practically consider this option of using a custom API gateway.

### Choosing the type of API Gateway

One of the configuration questions we can look at has to do with which type of (AWS) API Gateway we want. The traditional one is called _REST API_ and the newer, lighter-weight one that came out in 2019 is named _HTTP API_. All of this is probably somewhat confusing and you would not be the first one to feel so.

{% hint style="info" %}
These are sometimes also called **v1** for REST API and **v2** for HTTP API, which at least for me makes a lot more sense.

Do note that both of these types work just fine with actual HTTP(S) and REST; in fact, the naming is just plain bonkers!

Read more at [https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html).
{% endhint %}

Some of the additional features of the REST API (v1) vs the HTTP API (v2) include:

- AWS X-Ray tracing
- API keys support and per-client throttling
- Caching
- Request validation
- Edge-optimized endpoints

There are certainly benefits to going with the HTTP API as well, for example:

- Much cheaper to run
- They actually do support many (most?) features of v1
- Includes exclusive support for JWT authorization directly on the Gateway (v1 has to use a Lambda authorizer to do the same)
- Has exclusive support for certain integrations

From a non-functional requirements perspective, the items listed in the REST API benefits are things we absolutely want to use, and since price effectively is not a real concern at this small scale, that argument becomes moot.

## Security

As noted in the API section, there exists a few security aspects that we need to keep in mind.

We don't want to double down on security here, but we need to stay mindful of malicious usage. Ways we want to mitigate such usage are:

- Limit scaling and provide a maximum provisioned surface for APIs etc so we cannot get "denial-by-wallet" attacks
- Set permissions to least-privilege
- Secure coding practices
- Use authorization mechanisms, even something simple like an API key
- Use CORS to restrain domains that may call the services

{% hint style="info" %}
For a light start on serverless and cloud security, see the following:

- [10 Serverless security best practices](https://snyk.io/blog/10-serverless-security-best-practices/)
- [Architecting Secure Serverless Applications](https://aws.amazon.com/blogs/architecture/architecting-secure-serverless-applications/)
- [AWS re:Invent 2021 - Serverless security best practices](https://www.youtube.com/watch?v=nEaAuX4O9TU)
  {% endhint %}
