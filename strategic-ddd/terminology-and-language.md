---
description: Language and shared terminology is the central part of DDD.
---

# Terminology and language

<figure><img src="../.gitbook/assets/undraw_Word_of_mouth_re_ndo0.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

The core term in DDD is something that for us non-native English speakers is kind of a mouthful: the _ubiquitous language_.

**"Ubiquitous" in this context means that it's "everywhere around us" when we are in the domain**. You can think of it as being the common or natural jargon and words that people use when they work together in that context. As such, it's most likely non-technical in nature (at least in the software sense) and probably heavy on the business side.

Words are the core of DDD because they, as philosopher Ludwig Wittgenstein once wrote, shape the limits of the world for us:

> The limits of my language stand for the limits of my world. The limits of my language are the limits of my mind. All I know is what I have words for.
>
> — Ludwig Wittgenstein, "Tractatus Logico-Philosophicus" (1921)

Without the words to serve our purposes, our implementation will always suffer from such a lack. It is more efficient to discuss and collaborate and build a common shared "worldview" that can later be manifested, than haphazardly building and failing with something that does not match the actual needs because too little grounding was done.

It's not hard to find memes on how product managers, clients, and developers in a range of ways end up screwing each other over, or how software bellyflops into a completely detached state from the realities of the actual business needs. Of course, no one _wanted_ to actually end up in that situation, yet they did. I have been part of such failures, and I am sure you have been too.

Beginning with language has many benefits. One of them is that it's non-technical and something we can discuss without a proxy or intermediary. We can come to an understanding of words and processes and we can therefore learn them, thereby ultimately building something that is expressed through those same words and processes. We get to match the logical and semantic constructs with coded incarnations of them.

If it's not clear yet, all of this work has to be done in a cross-functional group where domain experts are part. Domain experts is a broad term but you can think of this as any people who have driving roles and knowledge in your business context. The result is collaborative work, rather than any sub-group having more (or less) privilege than any other. When an accepted set of terms is produced, [word is bond](https://www.urbandictionary.com/define.php?term=Word%20is%20bond).

As quoted by [Martin Fowler](https://martinfowler.com/bliki/UbiquitousLanguage.html), Eric Evans writes the following in _Domain Driven Design: Tackling Complexity in the Heart of Software_:

> By using the model-based language pervasively and not being satisfied until it flows, we approach a model that is complete and comprehensible, made up of simple elements that combine to express complex ideas. \[...]
>
> Domain experts should object to terms or structures that are awkward or inadequate to convey domain understanding; developers should watch for ambiguity or inconsistency that will trip up design.

Some important features to understand:

- The Ubiquitous Language is the _de facto_ standard nomenclature, so other similar words and terms must be avoided.
- The domain model and our subsequent implementations express the Ubiquitous Language.
- The Ubiquitous Language evolves organically over time. As per above, this needs to be reflected similarly in the software artifacts.
- Each domain will likely have its own Ubiquitous Language because of their respective meanings and semantics.
- Ubiquitous "Languages" are not meant to be efficient. Neither are they shared (well, if that doesn't make sense and is actually the way it is).

## Documenting the ubiquitous language

You can use whatever default means you have of documents, as long as it's common knowledge that this information is authoritative and co-owned and accessible to all who need to be able to see/edit it.

{% hint style="info" %}
Remember that the ubiquitous language is dynamic and ever-changing. It needs to be able to evolve, and we have to be receptive to that. As the language changes, we must similarly assure that the implementation stays intact and semantically aligned. Effectively any language change will be a technical change.
{% endhint %}

### Starting to understand the core domain language

Let's go back to our functional requirements and start sniffing out a language:

- **Reserve** a single **room** in a single **facility** (your office) and your time zone.
- **Reserve** the room in **slots** of 1 hour at the start of each hour.
- Allow for the **cancellation** of **room reservations.**
- Allow for rooms that are not **checked-in** within 10 minutes of their starting time to be **canceled** automatically.

With this, we have now collected `Reserve`, `Room`, `Slot`, `Facility`, `Cancellation`, `Room reservation`, and `Checked-in`.

### Filling in the blanks

Unsurprisingly, the language was fairly well-prepared already in the requirements. In a real-life scenario, it would be wise to either discuss/workshop around flows and requirements and peel out the terminology as you go, or to opt for EventStorming to help with that.

In our case, we could, at least after workshopping around the intended flows, see that we are missing for example `Checked-out`.

### Pruning the language

We can start cleaning the language a bit.

`Room reservation` sounds too verbose—we can cut this to just `Reservation` as these are always logically related only to `Room`s and their (time) `Slots.

| Concept      | Type  |
| ------------ | ----- |
| Reserve      | Verb  |
| Room         | Noun  |
| Slot         | Noun  |
| Facility     | Noun  |
| Cancellation | Noun  |
| Reservation  | Noun  |
| Check in     | Verb  |
| Check out    | Verb  |
| Checked-in   | State |
| Checked-out  | State |

{% hint style="info" %}
Later we will look at how EventStorming is a similar (optional, alternative) route we can take to do this and much more.
{% endhint %}

### The Analytics domain language

In the Analytics domain, we find one unique concept: The (analytics) `Record`.

### The Security domain language

The Security domain has, also, only a single unique concept: The (verification) `Code`.

## Delivery

In the reference implementation, this is simply shared as a separate diagram using a basic visual style where each term is described in a short sentence. In a real-life scenario, this format is probably quickly exhausted as definitions may need to be richer and exemplified. Note also how we ascribe the term to specific domains.\

![Describing, in short, our Ubiquitous Languages through the domain concepts](<../.gitbook/assets/Get-A-Room Ubiquitous Language.png>)

On the next page, we will see how EventStorming can be an additional or alternative approach to accumulating a domain model and language.
