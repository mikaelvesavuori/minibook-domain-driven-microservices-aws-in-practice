---
description: >-
  Design is the heart of software, regardless of your stance on if architects
  (or similar) should be coding or not.
---

# On design

<figure><img src="../.gitbook/assets/undraw_teamwork_hpdk.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

**Design and architecture are effectively the same, at least in their intents. At some point you won't have technical problems, only design problems relating to poor models, poor decisions, and poor structure.**

It's probably reasonable to believe most of us building software today began doing so by some combination of trial-and-error and following guided steps. As for me, who didn't graduate in Computer Science—but have in some way or another worked with computers since I was a kid—development is something that was learned on my own. In 1997, at the ripe age of 11, I would read any magazine that contained primitive HTML/web guides until the covers split. And oh boy did I spend time.

Like with any non-programming languages, also in programming there is of course a need to understand the _syntax_ ("grammar") and _semantics_ ("meaning") of the language. To some extent, it makes sense to start here. But relatively obscured, in my experience, is the need to understand the _design_ of programs.

Learning how to make something—anything, really—on a computer seems often to miss out on the higher-level aspects, such as _design_, i.e. "how do we put it all together in a good way?". This part is dangerously close to the trade secrets, and I've experienced this when studying anything between generative music, to painting and concept art, to—in our case—programming. Being new to the subject, we occupy so much of our time on the minor details, all-important though they seem at the time. Knee-deep in paracetamol pills and questioning the decision to learn programming in the first place, of course one is not in the ideal position to consider program design. Not "seeing the forest for the trees" is a fitting expression when we are in a learning mode.

{% hint style="danger" %}
I think the analogy of _design_ in non-programming languages might (...) work, but it's worth treading with caution: We build programs that are logical constructs in a way regular languages are not.
{% endhint %}

If you are anything like me, your first (perhaps young) years were a confusing mess of trying to understand _why exactly_ programs were structured the way they were, particularly when you began transitioning from single-file coding to "real" programs. I also remember from my own teaching days first-hand how students would be in equal measures entranced and dumbfounded by things even working with what could might as well look like a crappy stage magician's trick and a small length of wire holding it together. "How the hell does this work?", they would think (or say). A curious magic indeed.

I live in the assumption that academically trained engineers will scoff at everything written so far, since they perhaps had to read books like __ [_Design Patterns: Elements of Reusable Object-Oriented Software_](https://www.goodreads.com/book/show/85009.Design\_Patterns) __ (1994; Gamma, Johnson, Vlissides, Helm). Unfortunately, reading is a slow and brittle process, and simply reading does not guarantee understanding or adherence. In my practical and work experience I find that typically the "academic" (good or bad) aspects of building software are seldom natural parts of the day-to-day conversation.

Perhaps of my personal traits the design and structure parts have always been interesting, to the point of being my favorite parts of software engineering, and therefore been concerns that have naturally occupied quite some time on my end. I took a huge step in my career when I decided to switch fully to formal software engineering in 2015. However, this was nerve-wracking because, as anyone who is self-aware at all will recognize, suddenly you have to deal with people who are super-skilled experts in the subject. You become very self-critical approaching such a situation. Years later, for better or worse, I know what many know who have worked in the industry: That the software engineering field, and the people in it, are extremely diverse to the point of being hard to generalize in any capability.

One thing I do want to generalize on is **the role of design**, or perhaps more fitting the lack of such a role. I've come to the opinion (understanding...?) that somewhat universally, developers/engineers spend a lot less time on design than they are ought to do. A combination of attitudes seem to be pervasive, trying to fend away this reality:

* "Let the architect do it", or
* "There's no time and/or budget for design", or
* "It's Agile, man, f\*\*k design, it's part of the code", or
* Any other derivative of the same general attitude.

{% hint style="danger" %}
No, all my experiences are not aligned with this, but there is some persistent truth to the above in my professional career. It's more of a question of quantity of how apparent the attitude becomes rather than if the problem surfaces at all.
{% endhint %}

### Design does not equal BUFD (Big Up-Front Design)

One side of the word "design" that I feel to be misunderstood is around **how design relates to practices such as Agile** and its various forms—which is something every company and context I've been at has talked about, but not really delivered on—as well as to how the architect role fits in within modern software development, the DevOps paradigm, and being generally allergic to up-front planning.

It's nice then to see that this is less a real issue (i.e. not being supported in the orthodox Agile mindset) than it is a perceived issue, perpetuated by misguided business analysts, project/product managers, other peripheral figures and then the odd engineer here and there. We find evidence for this in how Agile framework co-founder Robert C. Martin tries to set the record straight in his [Clean Agile: Back to Basics](https://www.oreilly.com/library/view/clean-agile-back/9780135782002/) as well as in the humble "[connect the penthouse with the engine room](https://architectelevator.com)" metaphor stated by Gregor Hohpe. **They both express that **_**design**_** is something that must be done**, Agile or not, and that modern circumstances do not have to pass on a golden key to some Ivory Tower dude to handle the design on their own.

### Software design is not only the architect's territory

While many years ago I might have understood what an architect did, I personally gradually learned more and more on that side as I started building my own software, distributing open source, and leading technical teams as well as work on architecture proper.

Here too, as above, we see perhaps most clearly in Robert C. Martin's books, that there is almost a reluctance to talk about architects and architectures and rather spend time on design as a primary concept.

With more complex software needs, more complex technology, and more intricate organizations, it isn't strange to see that we now have a more multi-faceted range of architects operating today. Yet, this does not in any way relieve the burden (?) of design, especially on the system level, from the engineers.

### Triplet of skills

I'm conscious of the over-simplification that will shortly take place, but urge you to consider to point: **Without the basics you can't do the work, but without design it will never be **_**good**_** work**. So:

* Knowledge of proper **syntax** is what, hopefully, makes you able to pocket a paycheck for your work in the first place.
* Knowledge of proper **semantics** is what makes you write good, clean code (Think Uncle Bob advice etc.) on the _local_ level, file-by-file.
* Knowledge of proper **design** is what allows you to build _complete_ solutions that are competent and grow better over time.

This is a huge topic to unpack, what with its layers of psychology, leadership, organization, engineering, and other sub-areas coming into play. Henceforth what I am interested is stating that **design is important and it's your job as an engineer to handle it**. If you have an architect, then the conversation should likely hover around this topic. How you get to consistently conversing around this area is another problem I will not necessarily address.

## You have to design more to be better at it

Nothing has improved my own skills as much as setting up small projects with clear goals. Part of those goals should always be "What do I want to improve on, or learn?".

After having read this minibook, and maybe even trying to build the application on your own using the guidance here, take some time to reflect on what didn't make sense, what was hard, what you feel you can do better. Can the language improve? Can the abstractions be better handled? Can you be more expressive with relations between systems?

Reading is not the end goal—designing and reflecting on the results of the process is. And I'm not the only one adament in stating that domain-driven design is a solid foundation to build our design flow around, as well as informing how we practically develop our software as a team.
