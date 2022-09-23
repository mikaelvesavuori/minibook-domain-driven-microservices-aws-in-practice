---
description: >-
  Value objects help us define semi-complex, identityless objects without us
  needing to resort to spaghetti code.
---

# Value objects

{% hint style="success" %}
**TL;DR**

Description here TODO.
{% endhint %}

Value objects are a Godsend.

**Value objects are defined by attributes, not by identity**. This makes them great for cases where you want to provide a "vending machine" for non-trivial objects, such as in our case, a `TimeSlot`. The `TimeSlot` itself has no identity, but it does have unique values in non-unique keys/attributes. Because this type of object needs to **always be correctly constructed**, we can delegate the responsibility into (for example) a class that creates such TimeSlots. You don't pass around value objects that much, nor update them. Instead you instantiate new ones—they are 100% replacable and interchangeable, after all!

This pattern is effective in refactoring, such as when wanting to cut down on [primitive obsession](https://refactoring.guru/smells/primitive-obsession).

{% hint style="danger" %}
Producing non-entity objects might invite one to use "easy" and regressive patterns fished out of the recesses of one's memory bank. "These aren't important!" Wrong.
{% endhint %}

{% hint style="info" %}
For more, read [https://medium.com/swlh/value-objects-to-the-rescue-28c563ad97c6](https://medium.com/swlh/value-objects-to-the-rescue-28c563ad97c6)
{% endhint %}

## Creating a TimeSlot as a value object

If there is something I know I need to build more often, it's value objects.

Get-A-Room doesn't have very many value objects (two, in fact). Let's look at the `TimeSlot`. This is how it's used:

{% code title="code/Reservation/SlotReservation/src/domain/aggregates/Slot.ts" lineNumbers="true" %}
```typescript
const timeSlot = new TimeSlot();
const currentTime = this.getCurrentTime();

for (let slotCount = 0; slotCount < numberHours; slotCount++) {
  const hour = startHour + slotCount;
  timeSlot.startingAt(hour);
  const { startTime, endTime } = timeSlot.get();
  const newSlot = this.makeSlot({ currentTime, startTime, endTime });
  slots.push(newSlot);
}
```
{% endcode %}

And the value object itself:

{% code title="code/Reservation/SlotReservation/src/domain/valueObjects/TimeSlot.ts" overflow="wrap" lineNumbers="true" %}
````typescript
import { TimeSlotDTO } from '../../interfaces/TimeSlot';

import { InvalidHourCountError } from '../../application/errors/InvalidHourCountError';

/**
 * @description Handles the creation of valid time objects.
 */
export class TimeSlot {
  private startTime = '';
  private endTime = '';

  /**
   * @description Creates a valid time object. Requires an `hour` provided as
   * a number as input for the starting hour. Assumes 24 hour clock.
   *
   * All time slots are 1 hour long and provided as ISO strings.
   * @example ```
   * const timeSlot = new TimeSlot();
   * timeSlot.startingAt(8);
   * ```
   */
  public startingAt(hour: number): void {
    if (hour > 24) throw new InvalidHourCountError();
    if (hour <= 0) hour = 0;

    const startHour = hour.toString().length === 1 ? `0${hour}` : `${hour}`;
    const endHour = (hour + 1).toString().length === 1 ? `0${hour + 1}` : `${hour + 1}`;
    const day = new Date(Date.now()).toISOString().substring(0, 10);
    const startTime = new Date(`${day}T${startHour}:00:00`).toISOString();
    const endTime = new Date(`${day}T${endHour}:00:00`).toISOString();

    this.startTime = startTime;
    this.endTime = endTime;
  }

  /**
   * @description Returns a `TimeSlotDTO` for the start and end time.
   */
  public get(): TimeSlotDTO {
    return {
      startTime: this.startTime,
      endTime: this.endTime
    };
  }
}

````
{% endcode %}

To save on memory we are reusing the same `TimeSlot` instance and calling it several times throughout the loop. This is probably not the right way to do it in certain circumstances, but here I feel it makes sense as we are never relying on the instance of the value object itself, just asking it to return a Data Transfer Object based on the input data. Perhaps this can be seen as acceptable in the limited range of uses that we get to use `TimeSlot` for.

On the plus side, we are neatly encapsulating a lot of tedious detail out of the actual usage contexts. This also ensures that validation is done and that the integrity is correct and can be trusted; You'll see the error handling if we receive an hour count over 24, and how we are resetting any zero values to an acceptable base.

It should be clear that value objects can be as simple or complex as possible. Use them whenever you feel that unique data types or values need to be addressed in a controlled manner.
