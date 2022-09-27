---
description: Let's talk about the first big D in DDD.
---

# The domain(s)

<figure><img src="../.gitbook/assets/undraw_Shared_goals_re_jvqd.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

It's about time we make it clear what this "domain" thing is, right?

[Vaadin](https://vaadin.com/) has a fine two-part introduction to DDD and their distillation of the various domain types is short and informative enough for me to want to quote it wholesale:

> A **core domain** is what makes an organization special and different from other organizations. An organization cannot succeed (or even exist) without being exceptionally good in its core domain. Because the core domain is so important, it should receive the highest priority, the biggest effort, and the best developers. For smaller domains you may only identify a single core domain, larger domains may have more than one. You should be prepared to implement the features of the core domain from scratch.
>
> A **supporting subdomain** is a subdomain that is necessary for the organization to succeed, but it does not fall into the core domain category. It is not generic either because it still requires some level of specialization for the organization in question. You may be able to start with an existing solution and tweak it or extend it to your specific needs.
>
> A **generic subdomain** is a subdomain that does not contain anything special to the organization but is still needed for the overall solution to work. You can save a lot of time and work by trying to use off-the-shelf software for your generic subdomains. A typical example would be user identity management.
>
> — [Petter Holmström: DDD Part 1: Strategic Domain-Driven Design](https://vaadin.com/blog/ddd-part-1-strategic-domain-driven-design)

Recollecting what I have read and how I personally think about the _domain_ concept, for me the term has always been fairly straightforward and intuitive. If you do struggle with the concept (and its siblings core/supporting/generic subdomain) then remember that these are **logical constructs**, rather than theory-heavy notions. Understanding the relative sizes and relations of an organization or the parts of a project is something that has to be done in-situ, together with the people who:

- Know their way around the project/organization, and
- Will make things hard for you _if they are not part_ of making these divisions into the various domain types.

The problem I've found is that for some odd reason people just don't tend to go around all day speaking of "domains" :man_shrugging:. You'll probably walk away empty-handed if you ask the common business person in your organization "Hey there champ, [what's the deal with](https://www.youtube.com/watch?v=v1cVl7KHsGA) our domains?". Also, to divide systems into domains after they are fully designed is useless too. It should be done, at least coarsely, already in the initial design.

Instead, what you might want to do is to **introduce DDD as a framework, most importantly its ubiquitous language and domain concepts**, and begin discussing and doodling what the intended flows are if the scenario requires building something new. Equally important, and even more so if you are consulting or otherwise external to the organization, is to interview and map how the organization works (with some focus on the technology, if not only to understand how it may differ from the intended business domains).

In essence, you will want to make it clear that all sides have to cooperate to work within the frames of DDD since none of it will come intuitively in organizations as they typically look in the 2000s.

{% hint style="info" %}
Most of the bigger books on DDD include rich scenarios where you can kind of role-play along with the text about how these things might work out.
{% endhint %}

To document this you will want to think about questions like these:

- How many parts (i.e. _subdomains_) constitute your domain?
- Where do you make your money? Where do you lose your money?
- Where are your organizational pains?
- How does parts of the organization work together?
- Do the subdomains speak the same _ubiquitous language_ and are they truly part of the same domain or can they logically move out?
- What is the importance of the respective subdomains?
- How do subdomains interact? (i.e. _relationships_, _context mapping_)
- What leading data (i.e. _aggregates_) exists and who owns it and can modify it?
- What _commands_ may change leading data (_aggregates_) and who may create commands?
- How are changes to leading data (_aggregates_) communicated to others? (_domain events_)
- And more!

{% hint style="info" %}
If you use Miro, consider to use a template like this: [https://miro.com/miroverse/strategic-domain-driven-design-template/](https://miro.com/miroverse/strategic-domain-driven-design-template/)&#x20;
{% endhint %}

These are some of the common, quite untechnical questions that we need to start with as we start doing DDD. We will see soon start seeing examples of concrete artifacts that can be co-created to describe the domain.
