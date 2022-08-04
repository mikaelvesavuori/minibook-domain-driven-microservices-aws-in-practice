# Creating value objects

Example:

{% code title="code/Reservation/SlotReservation/src/domain/valueObjects/TimeSlot.ts" overflow="wrap" lineNumbers="true" %}
````typescript
import { TimeSlotDTO } from '../../interfaces/TimeSlot';

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
    const endHour = (hour + 1).toString().length === 1 ? `0${hour + 1}` : `${hour + 1}`;
    const day = new Date(Date.now()).toISOString().substring(0, 10);
    const startTime = new Date(`${day}T${startHour}:00:00`).toISOString();
    const endTime = new Date(`${day}T${endHour}:00:00`).toISOString();

    return {
      startTime,
      endTime
    };
  }
}
````
{% endcode %}
