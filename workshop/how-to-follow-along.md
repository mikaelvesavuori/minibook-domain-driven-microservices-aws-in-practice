---
description: There's a whole project to learn from (or build if you are so inclined).
---

# How to follow along

The general format of the rest of this book will be in the style of a guided tour, meaning that I will write sequentially (post-fact) about the key parts involved in landing a solution I feel encompasses what this book is trying to tell.

This example focuses on overall system design and the goal of setting up an event-driven architecture that fits our scenario.

{% hint style="info" %}
In the interest of time and energy, certain features of a full solution are therefore excluded from the scope of this exercise. Also, we should spend less time on details like worrying for conflicting names of rooms, as that is not what we are focusing our cognitive effort on.
{% endhint %}

You can...

* **Go on a guided tour**: Grab a coffee, just read and follow along with links and references to the work.

or

* **Do this as a full-on exercise**: Clone the repo, run `npm install` and `npm start` in the respective project folders, then read about the patterns and try it out in your own self-paced way.

## Structure

The root of the GitHub code repository will contain the following pertinent bits:

* `code`: Source code for the reference solution, divided into domains and then bounded context
* `data-modeling`: JSON files that show us an initial and final state of data that used between contexts/systems
* `diagrams`: Diagrams for the solution

## Data modeling

The `data-modeling` folder contains various forms of data which we can model and fill in for our use case.

I've found it a powerful tactic to do this type of work, as it's lightweight, fairly easy for non-technical people to understand, and can be a collaborative exercise. You can also actually use the JSON objects when you are writing your actual implementation later!

{% hint style="success" %}
We can skip any envelope level here and just focus on the original data contents instead.
{% endhint %}

{% hint style="success" %}
For dynamic values, set the field similar to the format `"<Some description here>"`.
{% endhint %}

## Commands

The below commands are those I believe you will want to use. See `package.json` for more commands!

* `npm start`: Runs Serverless Framework in offline mode
* `npm test`: Tests code
* `npm run deploy`: Deploys code with Serverless Framework
* `npm run release`: Run [standard-version](https://github.com/conventional-changelog/standard-version#cutting-releases)
* `npm run build`: Package and build the code with Serverless Framework

{% hint style="info" %}
Also note that the code's "[mono repo](https://monorepo.tools)" structure is more for convenience than a true "decision" as such.
{% endhint %}

## Prerequisites

_These only apply if you want to deploy code._

* Amazon Web Services (AWS) account with sufficient permissions so that you can deploy infrastructure. A naive but simple policy would be full rights for CloudWatch, Lambda, API Gateway, X-Ray, S3, and CodeDeploy.

### 1. Clone or fork the repo

Clone and fork the repo as you normally would.
