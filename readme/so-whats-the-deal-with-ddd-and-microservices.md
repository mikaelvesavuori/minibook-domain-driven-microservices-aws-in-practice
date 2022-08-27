# So what's the deal with DDD and microservices?

Why this combination of DDD and microservices? Both have become very popular for their own reasons: DDD because it understands that software is not just the engineering part, but also how it logically connects the physical and very real business end to software to accurately represents those ideas. DDD, even Eric Evans' original book from 2003, was also from the start expressive and rich and had many prescriptive ideas divided between the higher-level "strategic DDD" and the implementation patterns part of the "tactical DDD".

Microservices have grown in popularity as they, among other things, make it easier to build and represent distributed scenarios than building monoliths. As [Chandra Ramalingan writes](https://medium.com/walmartglobaltech/building-domain-driven-microservices-af688aa1b1b8), while leaning on prior work by [Fowler](https://martinfowler.com/articles/microservices.html) as well as [Newman](https://samnewman.io/books/building\_microservices\_2nd\_edition/), that the microservices architecture style could be summarized as:

> Loosely coupled service-oriented architecture, where each service is enclosed within a well-defined bounded context, enabling rapid, frequent, and reliable delivery of applications.

With the advent of Kubernetes and serverless functions, the practical operations around deploying them also significantly improved. Architects could finally _actually_ get those fine-grained services, and developers could finally build them faster and more neatly.

### The "why"

Part of the rationale for undertaking this project is because through the years in which I've encountered, learned, used, and encouraged DDD and Agile design, I have myself never really had a "full-size" springboard to examplify just how to do it. Also, because there are many components to this whole package, it's easy to kludge everything and spend too much time on details—sometimes techy stuff, sometimes the theory, or whatever else that felt most important that particular day. Perhaps most importantly, I find it highly relevant in our day and age where there seems sometimes to exist a conflict between developer empowerment (such as expressed through DevOps and Agile) with the very concept of "design" altogether.

It is my highest recommendation that you also read the source materials, as those are some of the most excellent books and articles I—and I am sure, many out there in the software world—have read on software architecture. My work simply complements and illustrates some of those basics in a practical scenario, rather than extensively elaborating on them.

## When is DDD too much?

TODO

## When  should we not do microservices?

TODO
