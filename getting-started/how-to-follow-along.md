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

- **Go on a guided tour**: Grab a coffee, just read and follow along with links and references to the work.

or

- **Do this as a full-on exercise**: Clone the repo, run `npm install` and `npm start` in the respective project folders, then read about the patterns and try it out in your own self-paced way.

## Structure

The root of the GitHub code repository will contain the following pertinent bits:

- `code`: Source code for the reference solution, divided into domains and then bounded context
- `data-modeling`: JSON files that show us a rough final state of data that is used between contexts/solutions
- `diagrams`: Diagrams for the solutions

## Data modeling

The `data-modeling` folder contains various forms of data that roughly represent their final shapes.

I've found it a powerful tactic to do this type of hands-on payload modeling work already at the outset of a project, as it's lightweight, fairly easy for non-technical people to understand, and can be a collaborative exercise. You can also actually use the JSON objects when you are writing your actual implementation later!

## Commands

The below commands are those I believe you will want to use. See `package.json` for more commands!

- `npm start`: Runs Serverless Framework in [offline mode](https://www.serverless.com/plugins/serverless-offline)
- `npm test`: Tests code
- `npm run docs`: Generates documentation
- `npm run deploy`: Deploys code with Serverless Framework
- `npm run teardown`: Package and build the code with Serverless Framework

{% hint style="info" %}
Also note that the code's "[mono repo](https://monorepo.tools)" structure is more for convenience than a true "decision" as such.
{% endhint %}

## Prerequisites

_These only apply if you want to deploy code._

- Amazon Web Services (AWS) account with sufficient permissions so that you can deploy infrastructure.
