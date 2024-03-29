---
description: Or the story of how an Italian guy made DDD concrete and friendly.
---

# EventStorming

<figure><img src="../.gitbook/assets/undraw_Career_development_re_sv91.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

[EventStorming](https://www.eventstorming.com) is a workshop model invented by Alberto Brandolini in 2012 to help facilitate explorative work in the spirit of Domain Driven Design. It's a fast-paced way of coming to a shared understanding among the attendees (who should span the maximum gamut of stakeholders), helping to shape requirements as well as understand the business process.

{% embed url="https://www.youtube.com/watch?v=mLXQIYEwK24" %}

The original format is very physical, using paper to cover a wall and making use of colored sticky notes and marker pens to, first, come to terms with the current notion of the project/work, and then bit by bit consolidate that view into sequential orderings of the core concepts:

* **Aggregates**, yellow
* **Commands**, blue
* **Domain events**, orange
* **Actors**, yellow (small)
* **Policies** (or business process), purple
* **Views** ("read models"), green
* **External system,** pink

According to Brandolini, the original non-technical, physical format is the preferred format, because (as far as I understood) it's easier to moderate, it's easier to adapt to the current group dynamic, and it simply has fewer constraints than you have with people tethered to their own screens.

{% hint style="success" %}
Supposing you want to do this physically, then I can recommend the following article by a person who has done this many times and has tons on tips on what stuff you need to buy: [https://baasie.com/2019/05/08/eventstorming-tools-what-is-in-my-flight-case/](https://baasie.com/2019/05/08/eventstorming-tools-what-is-in-my-flight-case/)

For my part I've purchased the ["Super Sticky" 3M Post-its in the "Rio de Janeiro" colorset](https://www.post-it.com/3M/en\_US/post-it/products/\~/Post-it-Super-Sticky-Notes-3-in-x-3-in-Rio-de-Janeiro-Collection-10-Pads-Pack/?N=4327+3290138629+3294529207\&rt=rud) which seem to pretty closely match the colors used in EventStorming.
{% endhint %}

It's completely possible to emulate the practicalities of Eventstorming in a remote, digital way. Tools like [Miro](https://miro.com) work just fine, and you can even do most of this with [Figma](https://www.figma.com) or [Excalidraw](https://excalidraw.com) if you really wanted to. Working by myself I resorted to my trusty old [Diagrams.net](https://www.diagrams.net) as it also made it easy to export for this book and the code repository.

{% hint style="info" %}
If you are a Miro user, consider using a ready-made template like this: [https://miro.com/miroverse/event-storming/](https://miro.com/miroverse/event-storming/)
{% endhint %}

## My solution

In the below picture you can see the end state of how I addressed this particular project. What is not quite apparent is of course the evolution of terms over time. In my first sketches and first rounds of work, for example, the term `Reserve` was not used. Instead, it was `Book`. But you don't really book a room, right, rather you reserve it.

On the good side, this exercise greatly improved even a completely fictional product made by one person! As a DDD apostle, you should always stay wary of any terminology that reads "Create", "Read", "Update" or "Delete"—in my case, it was never much of a problem

My take on this is not necessarily by the book, as we are also missing a key component: The sequential order of these.

![](<../.gitbook/assets/Get-A-Room Eventstorming.png>)
