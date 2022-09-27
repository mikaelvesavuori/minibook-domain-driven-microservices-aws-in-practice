---
description: >-
  How we translate complex object-oriented and single-process thinking into the
  cloud-native space.
---

# Putting DDD in the serverless context

<figure><img src="../.gitbook/assets/undraw_void_3ggu.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

We live in a time of change when it comes to technology and cloud with ever higher degrees of abstraction being presented as commercial products.

I will equate microservices roughly with serverless. Indeed they are not the same, but the scope of this chapter is also generally broader and more imprecise than what we will work on later.

In this chapter I want to elevate some of the issues that I have seen in understanding and working with serverless, so that we can better understand how the contents of this book attempt to solve real issues for you.

## Not just back-end engineers work with servers these days

I am one of those developers who became awestruck when I started to learn about and use serverless functions, in my case back in 2017. At that time these were much more primitive than today. Personally, I didn't want to become an expert on Redis caches or server maintenance, and really avoided lunch conversations with the backend people. As a front-end developer (and some Node) the things _around_ the server weren't really that enticing. You couldn't see what's going on, and it seemed like lots of heavy lifting for pretty much no gain—after all, people like myself were building the majority of the application! (Or so I thought... :smile:)

In the years since, I've had the possibility and fortune to onboard and move many developers into the cloud and various serverless products running on Azure, Google Cloud, and AWS. To be fair, the entire stacks have been primarily serverless. But why were they?

Firstly, of course because the serverless solution was a good fit (else we would have a real problem!) but also because I had learned first-hand myself what it means to reap the benefits of being able to do _more_ with less. And that certainly did not include any of the "[pet management](https://www.hava.io/blog/cattle-vs-pets-devops-explained)" that went on with the traditional-type back-enders. In a very real and tangible sense I could support developers with tools that gave them new abilities. I've seen this pay dividends both in small teams as well as in scaling out development teams at Polestar.

The backside of this is that back-end development, which has maybe sometimes been seen as more "privileged" than front-end development (and requiring most conventional software engineering background), is now actively conducted by developers who often do not carry the same core skills. This point will touch the next a bit, but the gist is that I have personally seen many examples of (often self-taught; like myself) developers build their back-ends with, often, a very different (objectively worse) sensibility than those who come with traditional engineering backgrounds. It's not that all front-end developers are _bad_ (that's not at all the point!), nor is it possible in an extremely wide industry like tech/IT to claim that everyone walked the same path, but I think it is both realistic and relevant to note that such overall enablement will mean an influx of people who lack some of the (sometimes unspoken) necessary skills of back-end engineers. Front-end work has generally had less need of the systematic and disciplined "school bench" engineering skills.

### In short

More people are enabled to work full stack because of serverless, but this influx also equates to a wider skills range, in turn ending up with the sector (and we as organizations) having to train people accordingly **if they lack core skills that they may not even be able to identify as deficits in the first place**.

## There's a pretty big skills shortage

As anyone in the IT world can probably attest to, there is a pervasive skills shortage. There's just too few people to do all the work out there! As a continuation on the above, while companies, schools, industry and even private initiatives try to drive in new blood, the competence curve has to be upped as well, to take new developments and technologies in consideration. I am still repelled by how many schools keep offering courses and training that quickly seems outdated, and how many companies are still holding on to technologies that at least I cannot really understand why they won't build away. There are always reasons, of course, but the more people etc. you bring in, the harder it will be to change; Basically, it's like keeping digging a deeper hole because it's convenient to not change task, i.e. move out of the hole.

There is an interplay between education, market, and industry in which certain technical developments may not be part of these trajectories. That means that in an ugly scenario we have something like the following to happen:

- **2022**: New technology starts being used ("widely enough" for our example)
- **2023**: Architecture group at Company puts the technology as part of its strategic vision; early recruiting for roles with the given tech skill starts; education curricula start updating with the technology
- **2024**: Education starts
- **2025-2027**: First batch of students learning the technology are graduating; technology is likely surpassed and/or replaced

The above is a made-up, dumb example, but it has some truth to it. Never expect the "traditional paths" to be fast enough to actually cater for your tactical recruiting and skill building needs.

Serverless gives developers a vast extension of capabilities but good use of it assumes **solid core skills**, ergo: It's likely easier to train someone from scratch to deliver basic value with serverless tech (augmenting the person and abstracting parts of typical engineering) than with older takes on the same things, but the question remains "Is this a good engineer at the end of it?".

### In short

Strong fundamentals in each candidate/employee/team member and aggressive, continuous learning supported by the organization is key here. Retaining and retraining current developers is probably the best value you can get, rather than trusting an uncertain supply.

## You might need to learn a lot of things anew

Going down this path will entail having to conceptually and practically accept that many well-used core technologies, like relational SQL databases, API frameworks like Express, and webservers like Nginx are often very different from the cloud-native products you will use when you go serverless. Certainly they are not 100% different, but adding up each area will end in a relatively significant total amount of work on your side to learn and/or re-learn how to build a complete solution.

It's not completely uncommon that some developers will struggle with adapting, complain about their experiences, or even actively resist learning if everything goes south. If you represent an organization or team, then definitely be level-headed and lucid that all learning is hard; it's just different levels of hard for all of us.

### In short

Expect to learn and that you need to support a team making the move to serverless.

## Serverless functions "identity crisis"

There is a minor identity crisis in the functions-as-a-service world that we can address in this book.

There are two typical styles:

1. Single purpose utility functions ("workflow-oriented" cases)
2. Entity-oriented functions ("back-end or API" cases)

Worst of all, it's not like it's being very clearly communicated, especially to newcomers. Why I find this detail important is that it points to a certain orthodoxy in the FaaS or microservice world. Are any of these familiar?

- "Microservices don't share a database"
- "Microservices are single purpose functions"
- "Microservices are no longer than a screen of text"

{% hint style="warning" %}
I've said and written all of those ideas or principles at some point and I am 100% sure you have seen most of those already if you have read up on this subject.

They aren't incorrect, as much as they are too narrow.
{% endhint %}

So the fact is that they are not really wrong, but that they have become doctrinal rather than indicative or guiding.

A silly and made-up but very realistic example of a valid question from an engineer could be:

> "If a Lambda function can only be \~100 lines long, how do I even get to writing a meaningfully complex service?

And that's where the _style_ of how we write functions starts mattering.

The style of examples, tutorials, and much of the code out there will use the single purpose style. It's very intuitive and nicely contained in for example a data processing example: Something comes in, you do a few snippets of code, and then exit with some status code. Brilliant. Except that a lot of real business use cases have to move beyond that... That's why we need to spend time looking at some patterns for structuring our code so that we keep the general spirit of serverless functions (well-contained, small, discrete) while supporting richer, more detailed business use-cases.

### In short

Understanding different styles of writing functions is important, so that we can apply the correct engineering measures to structuring, writing and testing our code. For a newbie, the Google wilds will not directly help with explicitly communicating the characteristics of these styles.&#x20;
