# Terminology and language

The core of DDD is something that for us non-English is kind of a mouthful: the "ubiquitous language". _Ubiquitous_ in this context means that it's everywhere around us, when we are in the domain. You can think of it as being the common or natural jargon and words that people use. As such, it's most likely non-technical (at least in the software sense) and probably heavy on the business side.

Words are the core in DDD because they, as philosopher Ludwig Wittgenstein once wrote, shape the limits of the world for us:

> The limits of my language stand for the limits of my world. The limits of my language are the limits of my mind. All I know is what I have words for.

Without the words to serve our purposes, our implementation will always suffer from that lack. It's not hard to find memes on how product managers, clients, and developers in a range of ways end of screwing up for each other, or how software ends up being completely detached from the realities of the actual business need. Of course no one _wanted_ to actually end up in that situation, yet they did.

Beginning with language has many benefits. One of them is that it's non-technical and something we can discuss with no proxy or intermediary. We can come to an understanding of words and processes and we can therefore learn them and therefore ultimately build something that is expressed through those same words and processes.

Some important features to understand:

* The UL evolves over time
* Each domain will likely have its own UL; these are not meant to be "efficient" or shared if that does not make sense
* The UL is the de facto standard nomenclature, so other similar words and terms should be avoided
* The domain model and our subsequent implementations express the UL

See more at [https://thedomaindrivendesign.io/developing-the-ubiquitous-language/](https://thedomaindrivendesign.io/developing-the-ubiquitous-language/).

\---

As quoted by [Martin Fowler](https://martinfowler.com/bliki/UbiquitousLanguage.html), Eric Evans writes the following in his book:

> By using the model-based language pervasively and not being satisfied until it flows, we approach a model that is complete and comprehensible, made up of simple elements that combine to express complex ideas.
>
> ...
>
> Domain experts should object to terms or structures that are awkward or inadequate to convey domain understanding; developers should watch for ambiguity or inconsistency that will trip up design.\
>

![](<../.gitbook/assets/Get-A-Room Ubiquitous Language.png>)
