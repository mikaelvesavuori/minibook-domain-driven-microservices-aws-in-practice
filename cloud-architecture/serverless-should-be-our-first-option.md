# Serverless should be our first option

Without being a one-sided advertisement I will still take a few minutes to lay out a technical strategy based around [serverless](https://www.ibm.com/cloud/learn/serverless). I find that in most cases, given that we can make a technical choice early in the process, that it's smart to optimize (as, and if, possible) towards serverless services.

Some of the well-known benefits of this include:

* **Cost-efficiency**, as serverless services can "scale to zero" meaning they cost nothing if no one uses it
* **Less management, maintenance, and toil** since the cloud service provider handles the majority of these parts
* **Easier to focus on innovation** since the skills requirement for proper implementation is lower than doing the whole shebang on your own
* **Makes it easier to adopt modern architecture patterns** like event-driven architecture and microservices because you are essentially forced (well, it just makes a lot more sense) to use API Gateways, event buses or topics, and short-lived functions to wire up your solution

One of my favorite examples of unwanted complexity comes from Yan Cui when trying to answer the oft-mentioned statement "[even simple serverless applications have complex architecture diagrams](https://medium.com/theburningmonk-com/even-simple-serverless-applications-have-complex-architecture-diagrams-so-what-8dc618fd4df6)". He addresses this perception as a kind of falsity, since it has been very common for developers and architects to conflate the logical (business) and physical (infrastructure) views or diagrams of systems, in which case a classical web server hosted on EC2) would look remarkable straightforward, while a Lambda-based microservice solution can look rather intimidating.

> Ask yourself what’s more important-having a simple-looking diagram of your application, or actually having a simpler application.
>
> Because a serverless application might look more complex on paper than its serverful counterpart, but only one of these diagrams is a true representation of you are running in your AWS account. And only one of these diagrams will give you a nasty surprise when you dare to open the box and see what’s inside.

The point here is that a benefit of serverless is that the diagram itself helps to actually outline what the logical functionality is, since we can be more expressive and fine-grained with resource usage, e.g. dedicated functions for unique business use-cases, logically separated databases for different information, and topics or event buses that are solely dedicated to handle needs of individual functions. Ergo, the quantity of cloud resources will indeed grow, but it can also (correctly used) be 100% truthful of what the system performs, rather than the classic 1-4 boxes of "magic providence" that _does all of it_.&#x20;
