# Scenario

The expensive and outdated room booking system at your company has been making life miserable for pretty much everyone there. Your team has volunteered to replace the system with a cost-efficient custom implementation, with a target of doing so within the space of one week. To drive down cost and maintenance you've already settled on using serverless cloud technologies as the core components. Now comes the real question: How do you _design_ the system?

You've just had a brainstorming session and a requirements workshop together with stakeholders from the business and office management side of things, as well as with some front end developers in the company.

For now, these are the identified requirements:

* Book rooms in one facility and time zone (could be more later)
* Book rooms in slots of 1 hour (might change or be dynamic later)
* Allow for the cancellation of room bookings
* Your team will focus on providing the back end, APIs and such; Front end is out of scope for your team
* Optional: Allow for rooms that are not checked-in within 10 minutes of their starting time to be cancelled

When it comes to integration work:

* Assume that the front end will require an updated views on bookings
* Assume that the front end will provide as input:
  * The user name
  * The room name or ID
  * The start and end times of the slot

How would you address this challenge?
