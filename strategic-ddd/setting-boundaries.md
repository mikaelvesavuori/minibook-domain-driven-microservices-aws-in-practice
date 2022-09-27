---
description: >-
  It's not fun to say "no" but without saying "no" there is no control we can
  exert over our domain landscape. Boundaries are the DDD way of including or
  excluding something in a context.
---

# Setting boundaries

<figure><img src="../.gitbook/assets/undraw_circles_y7s2.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

While the ubiquitous language might be the most pervasive and influential tool in the strategic DDD toolbox, I'd say that **the defining of Bounded Contexts remains the most powerful tool**. Language makes us define the concepts in play, as well as what (and how) they represent something. Setting boundaries on contexts, on the other hand, carves out the landscape, pointing out where responsibilities lay.

Oh, what the Bounded Contexts are?

> \[...] A Bounded Context is a semantic contextual boundary. This means that within the boundary each component of the software model has a specific meaning and does specific things. The components inside a Bounded Context are context specific and semantically motivated.
>
> — _Domain Driven Design Distilled_ (Vernon 2016, p. 11-12)

We use this construct to logically discuss and model our expectations on a given part of the overall problem space. This Bounded Context is then manifested, through programming, into a realized vision of the model. That's the Circle of Life, in DDD terms.

## Core principles

{% hint style="info" %}
I will adapt some of the great points made in [https://learn.microsoft.com/en-us/azure/architecture/microservices/model/microservice-boundaries](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/microservice-boundaries) and in _Domain-Driven Design Distilled_.
{% endhint %}

### One team, one repository, one Bounded Context

Segregate Bounded Contexts and any work in a meaningful way. Conventionally this is with one code repository for each team and Bounded Context. If it's not clear yet, often one Bounded Context translates into one technical solution.

### Bounded Contexts informs you where the system begins and ends

A Bounded Context is always designed from the actual business reality at hand. However, as long as you can meaningfully and accurately decompose parts in their own Bounded Contexts, you are free to do so.

Don't mix up domains, domain languages, or other semantics across multiple divergent needs in the same Bounded Context.

You do not care about anything outside the Bounded Context, only if necessary about any integrations.

### Aggregates are shaped by business needs

An Aggregate, as we will see, roughly equates to what is typically called **leading data**. An Aggregate is the core of most Bounded Contexts. If you cannot decompose the Aggregate into less than its _cohesive_ entirety, then you have found the true boundaries of the Aggregate.

### Aggregates don't depend on others

Consequently, services are completely independent of other services and Aggregates and whatnot. All of the required data and behavior is colocated in the Bounded Context, on the Aggregate. Therefore we can always "trust" the way that data is handled, updated, and modified over time. You do not "split the responsibility" with anyone else.

## Bounded Contexts in our example code

I will now step through some of the iterations I went through to come to terms with the overall modeling of the Get-A-Room application and somewhat improvise that experience to give you a sense of what it might look like.

### First attempt: Overall orientation

It was clear early on that there are multiple solutions, or Bounded Contexts, in play in the application/domain. Looking at the overall requirements I could see that analytics and security were completely separate, and that the reservation part might be better colocated together. That wasn't necessarily an immediate "score" in my mind but given that the nature of them is intertwined I decided to put them together.

<figure><img src="../.gitbook/assets/Get-A-Room Context Map 1.png" alt=""><figcaption><p>Bounded Contexts established.</p></figcaption></figure>

This should not be too controversial, I think.

## Subdomain or bounded context?

> One confusion that Evans sometimes notices in teams is differentiating between bounded contexts and subdomains. In an ideal world they coincide, but in reality they are often misaligned. He uses an example of a bank structured around cash accounts and credit cards. These two subdomains in the banking domain are also bounded contexts. After reorganising the business around business accounts and personal accounts, there are now two other subdomains, but the bounded contexts stay the same, which means they are now misaligned with the new subdomains. This often results in two teams having to work in the same bounded contexts with an increasing risk of ending up with a big ball of mud.
>
> — Source: https://www.infoq.com/news/2019/06/bounded-context-eric-evans/

As per DDD best practices, we want to have as close alignment as possible between subdomains and Bounded Contexts. Still, because we put Reservation and Display in the same (core) subdomain, that one gets a little fatter. Once again, this is acceptable given that Display will serve as essentially just a read-replica of the Reservation context.

<figure><img src="../.gitbook/assets/Get-A-Room Context Map 2.png" alt=""><figcaption><p>Diagram with only contexts + (sub)domain etc</p></figcaption></figure>

With the addition of subdomains we have now clarified their relative importance and set the maximum outer boundaries.

* Reservation is the core domain, which we will invest more heavily in
* Security is supporting, and we accept that we need to do some own work here for it to be useful in our application
* Analytics is ideally shipped to a commercial-off-the-shelf product or something similar; in Get-A-Room we set up a bare minimum custom implementation&#x20;

## Context maps and relationships

{% hint style="info" %}
For some informative light reading on this subject, see [https://medium.com/ingeniouslysimple/context-mapping-in-domain-driven-design-9063465d2eb8](https://medium.com/ingeniouslysimple/context-mapping-in-domain-driven-design-9063465d2eb8)
{% endhint %}

In terms of integrations it should be clear that these somehow need to interact with each other. But how?

* The Reservation context has a `Customer-Supplier relationship` with Display, meaning it supplies data in a way that is easy to represent. In this exact case, it's very close to the original format as it's not that complex.
* Reservation as a whole has a `Conformist relationship` with the Analytics context. This entails that the Analytics service/context dictates how they want data integrated.
* The Reservation context and the VerificationCode context have a `Published language relationship` which is a somewhat convoluted way of expressing that the security side will present a document API to use.

![Complete with relations](<../.gitbook/assets/Get-A-Room Context Map.png>)

## In summary

Having done all of this modeling, we are well on our way to understand the domain, how things fit together, how they interact and being super-clear on which services are worthy of more investment and care.
