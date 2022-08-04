# The Data Transfer Object

A bit of a misunderstood gold nugget, which gets a more nuanced use in a DDD context.

Example:

{% code title="code/Reservation/SlotReservation/src/interfaces/Slot.ts" lineNumbers="true" %}
```typescript
/**
 * @description Represents the valid and complete data of a
 * correctly shaped Slot entity.
 */
export interface SlotDTO {
  /**
   * @description The ID of this slot.
   */
  slotId: string;
  /**
   * @description The name of the host. Empty at first.
   */
  hostName: string;
  /**
   * @description The time object with start and end times.
   */
  timeSlot: TimeSlotDTO;
  /**
   * @description Status of the slot.
   */
  slotStatus: Status;
  /**
   * @description Time of creation of the slot using ISO format.
   */
  createdAt: string;
  /**
   * @description Time of last update of the slot using ISO format.
   */
  updatedAt: string;
}
```
{% endcode %}
