---
description: There's a full application for us to discover!
---

# Getting started

This example and workshop focuses on overall system design and the goal of setting up an event-driven architecture.

The format will be of a guided tour, meaning that I will write sequentially (post-fact) about the key parts involved in landing a solution I feel encompasses what this book is trying to tell.

In the interest of time and energy, certain features of a full solution are therefore excluded from the scope of this exercise. Also, we should spend less time on details like worrying for conflicting names of rooms, as that is not what we are focusing our cognitive effort on.

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

## Goals

TODO
