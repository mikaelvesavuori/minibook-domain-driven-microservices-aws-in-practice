# Creating value objects

If there is something I know I need to build more often, it's value objects.

Get-A-Room doesn't have very many value objects (two, in fact). Let's look at the TimeSlot one:

{% code title="code/Reservation/SlotReservation/src/domain/valueObjects/TimeSlot.ts" overflow="wrap" lineNumbers="true" %}

````typescript
import { TimeSlotDTO } from "../../interfaces/TimeSlot";

/**
 * @description Handles the creation of valid time objects.
 */
export class TimeSlot {
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
  startingAt(hour: number): TimeSlotDTO {
    const startHour = hour.toString().length === 1 ? `0${hour}` : `${hour}`;
    const endHour =
      (hour + 1).toString().length === 1 ? `0${hour + 1}` : `${hour + 1}`;
    const day = new Date(Date.now()).toISOString().substring(0, 10);
    const startTime = new Date(`${day}T${startHour}:00:00`).toISOString();
    const endTime = new Date(`${day}T${endHour}:00:00`).toISOString();

    return {
      startTime,
      endTime,
    };
  }
}
````

{% endcode %}

So, we can see that this one returns a Data Transfer Object, thus the object somewhat unfortunately (as opposed to what I've been writing earlier) separates data and behavior. While, to be fair, there is just a single method, there is no reusability either. Perhaps this can be seen as acceptable in the limited range of uses that we get to use `TimeSlot` for.

On the plus side, we are neatly encapsulating a lot of tedious detail out of the actual usage contexts. This also ensures that validation is done and that the integrity is correct and can be trusted.

TODO: add error if more than 24 hours?
