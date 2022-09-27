---
description: So what's the deal with Domain Driven Design and microservices?
---

# Why DDD and microservices are a match

<figure><img src="../.gitbook/assets/undraw_friendship_mni7.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

To understand microservices is to be aware of the "prior art", namely Service Oriented Architecture (SOA) that dates back to the 1990s. Without making this into a history class, the scope of SOA was wider than that of microservices and built on a technical foundation that for natural reasons is not necessarily the basis of modern organizations. It may be fair to call microservices a particular subset of evolved SOA.

{% hint style="info" %}
Read more at:

- [https://en.wikipedia.org/wiki/Service-oriented_architecture](https://en.wikipedia.org/wiki/Service-oriented_architecture)
- [https://www.ibm.com/cloud/blog/soa-vs-microservices](https://www.ibm.com/cloud/blog/soa-vs-microservices)
  {% endhint %}

Microservices have grown in popularity as they, among other things, make it easier to build and represent distributed scenarios than building monoliths. As stated by [Amundsen, Nadareishvili, Mitra, and McLarty](https://www.oreilly.com/library/view/microservice-architecture/9781491956328/) and referenced at [O'Reilly](https://www.oreilly.com/content/a-quick-and-simple-definition-of-microservices/), microservices are:

> - Small in size
> - Messaging enabled
> - Bounded by contexts
> - Autonomously developed
> - Independently deployable
> - Decentralized
> - Built and released with automated processes
>
> — Source: [https://www.oreilly.com/content/a-quick-and-simple-definition-of-microservices/](https://www.oreilly.com/content/a-quick-and-simple-definition-of-microservices/)

{% hint style="info" %}
For more reading, see for example:

- [https://martinfowler.com/articles/microservices.html](https://martinfowler.com/articles/microservices.html)
- [https://samnewman.io/books/building_microservices_2nd_edition/](https://samnewman.io/books/building_microservices_2nd_edition/)
  {% endhint %}

Microservices (with their above qualities) make it easier to _express, as technical artifacts, the business domain language_.

With the advent of Kubernetes and serverless functions, the practical operations around deploying services also significantly improved. Architects could finally _actually_ get those fine-grained services, and developers could finally build them faster and more neatly. This meant that DDD could move out of the enthusiast/nerd/Java/enterprise context and start being applied in broader circumstances.

## How do domains communicate?

Using primarily messaging mechanisms—such as Kafka or AWS EventBridge—we can make the domains and their respective bounded contexts able to communicate with each other. Certainly, you can use traditional request/reply communication via REST APIs (and similar).

{% hint style="info" %}
I am writing another book for events that will go deeper on this subject.
{% endhint %}

What's worth keeping in mind is that there is little that is "new" with this way compared to traditional service-to-service communication. Ideally we would have:

- Documentation for the API and events (using a modern schema format like [AsyncAPI](https://www.asyncapi.com))
- Microservice discovery catalog (like [Catalogist](https://github.com/mikaelvesavuori/catalogist) or [Port](https://www.getport.io))

Using the strategic and tactical patterns of DDD we can do the intellectual, as well as technical, labor required to set our path.

## Is DDD still relevant?

So if DDD is \~20 years old, isn't that ancient and archaic by today's standards?

This is a very valid question. However, without going on a philosophical detour, we need to remember that some things in computing and technology change frequently, while others do not. Consider the following:

- \__[\_Design Patterns: Elements of Reusable Object-Oriented Software_](https://www.goodreads.com/book/show/85009.Design\_Patterns) (Gamma, Johnson, Vlissides, Helm) was written in 1994.
- \__[\_The Pragmatic Programmer: From Journeyman to Master_](https://www.goodreads.com/book/show/4099.The\_Pragmatic\_Programmer) (Hunt, Thomas) was written in 1999.
- \__[\_Refactoring: Improving the Design of Existing Code_](https://www.goodreads.com/book/show/44936.Refactoring) (Fowler) was written in 1999.
- \__[\_Patterns of Enterprise Application Architecture_](https://www.goodreads.com/book/show/70156.Patterns\_of\_Enterprise\_Application\_Architecture) (Fowler, Rice, Foemmel, Hieatt, Mee, Stafford) was written in 2002.
- [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.goodreads.com/book/show/3735293-clean-code) (Martin) was written in 2008.

{% hint style="info" %}
For more examples (including books going as far back as the 1970s!) see [https://softwareengineering.stackexchange.com/questions/124630/is-there-an-expiration-date-for-well-regarded-but-old-books-on-programming](https://softwareengineering.stackexchange.com/questions/124630/is-there-an-expiration-date-for-well-regarded-but-old-books-on-programming)
{% endhint %}

Principles and broad patterns simply don't age as much as (most) languages and pretty much anything that is only implementation-oriented. It's safe to say that DDD and its patterns have survived many changes in technology without losing its relevance—though absolutely there are other approaches to DDD popping up.

The bigger issue with DDD and related terms is that with popularity and the acronym going into more widespread use, we start to have a less cohesive understanding of the term. This is not unique to DDD in any way! The sentiment is echoed very well by `aryehof` on Reddit's thread "[Is Domain Driven Design still the recommended approach for enterprise applications or has any newer approach superseded it?](https://www.reddit.com/r/java/comments/n0kukj/is_domain_driven_design_still_the_recommended/)":

> **Well what is in the original DDD book is not what tends to be written about or used in practice**. The book is about how to successfully and repeatedly implement the plumbing to support a complex problem domain object model. It advocates that standard plumbing so you can _concentrate_ on object modeling the problem domain.
>
> > "The goal of domain-driven design is to create better software by focusing on a model of the domain rather than technology.", Eric Evans, Domain Driven Design p148.
>
> **Unfortunately, very very few know how to object model a domain model independent of UI and persistence, so all sort of **_**alternatives**_** have arisen**. Most notably Event Sourcing/CQRS, or Data Table based object model architectures (aka Repository Driven Development), or "it's really just about boundaries and language" (lol). **This is particularly the case in the .NET world where object modeling was never advocated by Microsoft or adopted by the community given its database tooling/wizard orientation.**
>
> So DDD is popular in the same way that “Agile” is. In both cases their meanings have been corrupted in popular use, and in DDD's by a community that hasn't even read _the_ book ("but hey we read some articles or YouTube"). So something ambiguously labeled "DDD" is often recommended today, but does that really help?

With this book I definitely don't want to fall over on the wrong side of history!

To be fair, I've had a situation like this in mind while writing and I believe you will have a broader yet practical understanding of DDD without us overcomplicating things more than warranted.&#x20;

{% hint style="info" %}
It is my highest recommendation that you also read the source materials, as those are some of the most excellent books and articles I—and I am sure, many out there in the software world—have read on software architecture.

My own work with this book and project simply complements and illustrates some of those basics in a practical scenario, rather than extensively elaborating on them.
{% endhint %}

## But...!

Let's look at some reasonable objections to our two core subjects. These might seem off-kilter, since I'm not changing course as we are just starting, but giving you a taste of when the approach we will work with may be too much.

### "DDD might be too much?"

Yes.

This point is raised in at least Evans' book, Vernon's book, and [_Learning Domain-Driven Design: Aligning Software Architecture and Business Strategy_](https://www.goodreads.com/en/book/show/57573212-learning-domain-driven-design) by Vladik Khononov. So no surprises.

Their point, and mine, is typically that trivial and/or CRUD-oriented systems are good examples of when there is no meaningful reason to pursue the route of DDD. Based on the fact that a lot more software than we sometimes want to accept is just trivial "getting and setting" of basic data, this point should carry across powerfully over a rather wide swath of software engineering projects.

{% hint style="info" %}
You can find deeper, but often somewhat similar, lines of thought being presented in the serious literature around DDD, but for an online version see for example this one. (TODO)
{% endhint %}

There are ways to make DDD more managable and I am satisfied with the coded solution we will work on as being representative of such a "lighter-weight" path.

### "Microservices might be complicating things?"

Yes.

Microservices have, as every architectural decision and architecture style, its own trade-offs and pros and cons. In the early design stages it should be clear if there are sufficient reasons to opt for a domain-driven, message oriented and decoupled landscape or if another type of solution makes better sense.

{% hint style="info" %}
Read more about related concerns at:

- [https://en.wikipedia.org/wiki/Architecture_tradeoff_analysis_method](https://en.wikipedia.org/wiki/Architecture_tradeoff_analysis_method)
- [https://en.wikipedia.org/wiki/Non-functional_requirement](https://en.wikipedia.org/wiki/Non-functional_requirement)
- [https://jasonformat.com/application-holotypes/](https://jasonformat.com/application-holotypes/)
- [https://continuousarchitecture.com/continuous-architecture-principles/](https://continuousarchitecture.com/continuous-architecture-principles/)
  {% endhint %}

One of the most obvious and significant negative sides of microservices is that their relative autonomy means that you get a linear amount of extraneous "surface area" for each new service: Starting perhaps with the same CI pipes, same scaffolding, same interfaces, and so on. These might be duplicated, or worse, contain tiny differences in between them. At the same time, there are ways to handle this (like loading several repos into an IDE workspace, "poor man's mono repo style") or simply accept that each service is truly decoupled from the others. :person_shrugging:

Similar to the previous point (on DDD sometimes being "too much") it's sometimes a better proposition to make a monolith, or to at least bundle applications/systems in a coarser fashion. There is nothing controversial with that. However, by doing so you also discard the quality attributes of microservices (independence, scalability,likely more natural representation of bounded contexts, etc.).

During my years working with microservices, as with anything, I have learned that the notion of microservices being _complicated_ (or _complicating_) or not is very dependent on an engineer's or architect's background and experience. Personally, I've grown a lot since working with serverless microservices as they abstract the "right things" while providing the powerful tools I expect in a modern tech environment. Without them I would not have started my back-end journey the way I did. So as ever: One man's curse is another's gift.

## In closing

Any architecture style, framework, and approach will bring something to learn and adapt to. DDD has stuck around successfully for a long time and adapted well to the changes in the technology landscape. Over time we've also seen in actuality how to bring the essence of DDD while making it easier to work with.

The state of the matter is still, as has been the case since 2003, that DDD (in totality) is not a panacea for all software design cases. This should not come as a surprise to anyone even tangentially interested in Domain Driven Design.
