---
description: There's a full application for us to discover!
---

# What we will be building

## Scenario

The expensive and outdated room booking system at your company has been making life miserable for pretty much everyone there. Your team has volunteered to replace the system with a cost-efficient custom-made implementation, with a target of doing so within the space of a couple of weeks. To drive down cost and maintenance you've already settled on using serverless cloud technologies as the core components. Now comes the real question: How do you _design_ the system?

You've just had a brainstorming session and a requirements workshop together with stakeholders from the business and office management side of things, as well as with some front end developers in the company.

For now, these are the identified high-level requirements:

* Reserve a _single_ room in a _single_ facility (your office) and your time zone
* Reserve the room in slots of 1 hour at the start of each hour
* Allow for the cancellation of room reservations
* Your team will focus on providing the back end, APIs and such, front end is out of scope for your team
* Allow for rooms that are not checked-in within 10 minutes of their starting time to be cancelled automatically
* The solution needs to have at least some minimum hygiene level of resilience and security

When it comes to integration work:

* Assume that the front end will require an updated views on bookings
* Assume that the front end will provide as input:
  * The user name
  * The room name or ID
  * The start and end times of the slot

**How would you address this challenge?**

## Structure

The root of the GitHub code repository will contain the following pertinent bits: (TODO)

* `code`: Source code
* `data-modeling`: JSON files to use when starting to model the data
* `diagrams`: Diagrams for the solution

## Data modeling

The `data-modeling` folder contains various forms of data which we can model and fill in for our use case.

We can skip any envelope level here and just focus on the original data contents instead.

For dynamic values, set the field similar to the format `"<Some description here>"`.

## Goals

TODO

