# Aggregates and entities

Example:

{% code title="code/Reservation/SlotReservation/src/domain/aggregates/SlotAggregate.ts" lineNumbers="true" %}
```typescript
import { randomUUID } from 'crypto';
import fetch from 'node-fetch';
import { MikroLog } from 'mikrolog';

import { TimeSlot } from '../valueObjects/TimeSlot';
import {
  CancelledEvent,
  CheckedInEvent,
  CheckedOutEvent,
  CreatedEvent,
  ReservedEvent,
  UnattendedEvent
} from '../valueObjects/Event';

import { SlotDTO, SlotDependencies, SlotInput, SlotId, Status } from '../../interfaces/Slot';
import { Repository } from '../../interfaces/Repository';
import { EventEmitter } from '../../interfaces/EventEmitter';
import { Dependencies } from '../../interfaces/Dependencies';
import { ReserveOutput } from '../../interfaces/ReserveOutput';
import { MetadataConfigInput } from '../../interfaces/Metadata';
import { Event } from '../../interfaces/Event';

import { MissingInputDataFieldError } from '../../application/errors/MissingInputDataFieldError';
import { MissingInputDataTimeError } from '../../application/errors/MissingInputDataTimeError';
import { MissingDependenciesError } from '../../application/errors/MissingDependenciesError';
import { MissingSlotError } from '../../application/errors/MissingSlotError';
import { MissingSecurityApiEndpoint } from '../../application/errors/MissingSecurityApiEndpoint';
import { CheckInConditionsNotMetError } from '../../application/errors/CheckInConditionsNotMetError';
import { CheckOutConditionsNotMetError } from '../../application/errors/CheckOutConditionsNotMetError';
import { CancellationConditionsNotMetError } from '../../application/errors/CancellationConditionsNotMetError';
import { ReservationConditionsNotMetError } from '../../application/errors/ReservationConditionsNotMetError';
import { FailedGettingVerificationCodeError } from '../../application/errors/FailedGettingVerificationCodeError';
import { MissingEnvVarsError } from '../../application/errors/MissingEnvVarsError';

/**
 * @description The Slot acts as the aggregate root for Slots (representing rooms
 * and their availability), enforcing all the respective invariants ("statuses")
 * of the Slot entity.
 */
export class SlotAggregate {
  repository: Repository;
  eventEmitter: EventEmitter;
  metadataConfig: MetadataConfigInput;
  logger: MikroLog;
  analyticsBusName: string;
  domainBusName: string;
  securityApiEndpoint: string;

  constructor(dependencies: Dependencies) {
    const { repository, eventEmitter, metadataConfig } = dependencies;
    this.repository = repository;
    this.eventEmitter = eventEmitter;
    this.metadataConfig = metadataConfig;
    this.logger = MikroLog.start();

    if (!repository || !eventEmitter) throw new MissingDependenciesError();

    this.analyticsBusName = process.env.ANALYTICS_BUS_NAME || '';
    this.domainBusName = process.env.DOMAIN_BUS_NAME || '';
    this.securityApiEndpoint = process.env.SECURITY_API_ENDPOINT_GENERATE || '';

    if (!this.domainBusName || !this.analyticsBusName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'DOMAIN_BUS_NAME', value: process.env.DOMAIN_BUS_NAME },
          { key: 'ANALYTICS_BUS_NAME', value: process.env.ANALYTICS_BUS_NAME }
        ])
      );
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * @description Create a valid, starting-state ("open") invariant of the Slot.
   */
  private makeSlot(slotRequest: SlotDependencies): SlotDTO {
    const { currentTime, startTime, endTime } = slotRequest;

    return {
      slotId: this.getNewUuid(),
      hostName: '',
      timeSlot: {
        startTime,
        endTime
      },
      slotStatus: 'OPEN',
      createdAt: currentTime,
      updatedAt: currentTime
    };
  }

  /**
   * @description Returns the current time as an ISO string.
   */
  private getCurrentTime(): string {
    return new Date().toISOString();
  }

  /**
   * @description Returns the end of the grace period until a reserved
   * slot is deemed unattended and returns to open state.
   */
  private getGracePeriodEndTime(startTime: string): string {
    const minutes = 10;
    const msPerMinute = 60 * 1000;
    return new Date(new Date(startTime).getTime() + minutes * msPerMinute).toISOString();
  }

  /**
   * @description Validates incoming input data.
   * @param onlyCheckReservationDataInput Used for reservations in which case we only have limited ingoing data.
   */
  private validateInputData(
    data: Record<string, any>,
    onlyCheckReservationDataInput?: boolean
  ): SlotDTO {
    // Force data into a new object to get rid of anything dangerous that might have made it in
    const stringifiedData = JSON.stringify(data);
    const parsedData = JSON.parse(stringifiedData);

    // Verify presence of required fields
    const requiredFields = onlyCheckReservationDataInput
      ? ['slotId', 'hostName']
      : ['slotId', 'timeSlot', 'slotStatus', 'createdAt', 'updatedAt'];
    requiredFields.forEach((key: string) => {
      const value = parsedData[key];
      if (!value) throw new MissingInputDataFieldError();
      else if (key === 'timeSlot') {
        if (!parsedData['timeSlot']['startTime'] || !parsedData['timeSlot']['endTime'])
          throw new MissingInputDataTimeError();
      }
    });

    // Construct new Slot without any additional, non-required fields that might have been injected
    const reconstitutedSlot: Record<string, any> = {};
    Object.entries(data).forEach((entry: any) => {
      const [key, value] = entry;
      if (requiredFields.includes(key)) reconstitutedSlot[key] = value;
    });

    // Add `hostName` if one existed
    if (parsedData['hostName']) reconstitutedSlot['hostName'] = parsedData['hostName'];

    return reconstitutedSlot as SlotDTO;
  }

  /**
   * @description Convenience method to emit an event to the domain bus
   * and optionally to the analytics bus.
   */
  private async emitEvents(event: Event): Promise<void> {
    const source = event.get().Source;

    await this.eventEmitter.emit(event.get());
    this.logger.log(`Emitted '${source}' to '${this.domainBusName}'`);

    await this.eventEmitter.emit(event.getAnalyticsVariant(this.analyticsBusName));
    this.logger.log(`Emitted '${source}' to '${this.analyticsBusName}'`);
  }

  /**
   * @description Utility to load and validate data single item from repository.
   */
  private async loadSlot(slotId: SlotId): Promise<SlotDTO> {
    const data = await this.repository.loadSlot(slotId);
    if (data) return this.validateInputData(data);

    throw new MissingSlotError();
  }

  /**
   * @description Utility to load and validate multiple items from repository.
   */
  private async loadSlots(): Promise<SlotDTO[]> {
    const items = await this.repository.loadSlots();
    return items.map((item: Record<string, any>) => this.validateInputData(item));
  }

  /**
   * @description Utility to correctly update the common fields in an
   * invariant state of a Slot and pass it to the repository.
   *
   * Any other fields need to be updated prior to calling this method!
   */
  private async updateSlot(slot: SlotDTO, status: Status): Promise<void> {
    slot['slotStatus'] = status;
    slot['updatedAt'] = this.getCurrentTime();
    this.validateInputData(slot);
    await this.repository
      .updateSlot(slot)
      .then(() => this.logger.log(`Updated status of '${slot.slotId}' to '${status}'`));
  }

  /**
   * @description Get new stringified UUID version 4 value.
   */
  private getNewUuid(): string {
    return randomUUID().toString();
  }

  /**
   * @description Connect to Security API to generate code.
   */
  private async getVerificationCode(slotId: string): Promise<string> {
    if (!this.securityApiEndpoint) throw new MissingSecurityApiEndpoint();

    return await fetch(this.securityApiEndpoint, {
      body: JSON.stringify({
        slotId: slotId
      }),
      method: 'POST'
    }).then((res: any) => {
      if (res?.status >= 200 && res?.status < 300) return res.json();
    });
  }

  /**
   * USE CASES ETC.
   */

  /**
   * @description Make all the slots needed for a single day (same day/"today").
   *
   * "Zulu time" is used, where GMT+0 is the basis.
   *
   * @see https://time.is/Z
   */
  public async makeDailySlots(): Promise<void> {
    const slots: SlotDTO[] = [];

    const timeSlot = new TimeSlot();
    const currentTime = this.getCurrentTime();
    const numberHours = 10;
    const startHour = 8;

    for (let slotCount = 0; slotCount < numberHours; slotCount++) {
      const hour = startHour + slotCount;
      const { startTime, endTime } = timeSlot.startingAt(hour);
      const newSlot = this.makeSlot({ currentTime, startTime, endTime });
      slots.push(newSlot);
    }

    const addSlots = slots.map(async (slot: SlotDTO) => {
      await this.repository.updateSlot(slot);

      const { slotId, hostName, slotStatus, timeSlot } = slot;

      const event = new CreatedEvent({
        event: {
          eventName: 'CREATED', // Transient state
          slotId,
          slotStatus,
          hostName,
          startTime: timeSlot.startTime
        },
        eventBusName: this.domainBusName,
        metadataConfig: this.metadataConfig
      });

      await this.emitEvents(event);
    });

    await Promise.all(addSlots);
  }

  /**
   * @description Updates a Slot to be in `OPEN` invariant state by cancelling the current state.
   *
   * Can only be performed in `RESERVED` state.
   *
   * @emits `CANCELLED`
   */
  public async cancel(slotId: SlotId): Promise<void> {
    const slot = await this.loadSlot(slotId);
    const { slotStatus, hostName, timeSlot } = slot;
    const { startTime } = timeSlot;
    if (slotStatus !== 'RESERVED') throw new CancellationConditionsNotMetError(slotStatus);

    const newStatus = 'OPEN';
    await this.updateSlot(slot, newStatus);

    const event = new CancelledEvent({
      event: {
        eventName: 'CANCELLED', // Transient state
        slotId,
        slotStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.emitEvents(event);
  }

  /**
   * @description Updates a Slot to be in `RESERVED` invariant state.
   *
   * Can only be performed in `OPEN` state.
   *
   * @emits `RESERVED`
   */
  public async reserve(slotInput: SlotInput): Promise<ReserveOutput> {
    this.validateInputData(slotInput, true);
    const { slotId, hostName } = slotInput;

    const slot = await this.loadSlot(slotId);
    const { slotStatus, timeSlot } = slot;
    const { startTime } = timeSlot;
    if (slotStatus !== 'OPEN') throw new ReservationConditionsNotMetError(slotStatus);

    // We do the verification code stuff before committing to the transaction
    const verificationCode = await this.getVerificationCode(slotId);
    if (!verificationCode) throw new FailedGettingVerificationCodeError('Bad status received!');

    const newStatus = 'RESERVED';

    await this.updateSlot(
      {
        ...slot,
        hostName: hostName || ''
      },
      newStatus
    );

    const event = new ReservedEvent({
      event: {
        eventName: newStatus,
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.emitEvents(event);

    return {
      code: verificationCode
    };
  }

  /**
   * @description Updates a Slot to be in `CHECKED_IN` invariant state.
   *
   * Can only be performed in `RESERVED` state.
   *
   * @emits `CHECKED_IN`
   */
  public async checkIn(slotId: SlotId): Promise<void> {
    const slot = await this.loadSlot(slotId);
    const { slotStatus, hostName, timeSlot } = slot;
    const { startTime } = timeSlot;
    if (slotStatus !== 'RESERVED') throw new CheckInConditionsNotMetError(slotStatus);

    const newStatus = 'CHECKED_IN';
    await this.updateSlot(slot, newStatus);

    const event = new CheckedInEvent({
      event: {
        eventName: newStatus,
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.emitEvents(event);
  }

  /**
   * @description Updates a Slot to be in `OPEN` invariant state by checking out from the current state.
   *
   * Can only be performed in `CHECKED_IN` state.
   *
   * @emits `CHECKED_OUT`
   */
  public async checkOut(slotId: SlotId): Promise<void> {
    const slot = await this.loadSlot(slotId);
    const { slotStatus, hostName, timeSlot } = slot;
    const { startTime } = timeSlot;
    if (slotStatus !== 'CHECKED_IN') throw new CheckOutConditionsNotMetError(slotStatus);

    const newStatus = 'OPEN';
    await this.updateSlot(slot, newStatus);

    const event = new CheckedOutEvent({
      event: {
        eventName: 'CHECKED_OUT', // Transient state
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.emitEvents(event);
  }

  /**
   * @description Updates a Slot to be in "open" invariant state.
   */
  public async setOpen(slotId: SlotId): Promise<void> {
    const slot = await this.loadSlot(slotId);
    slot['hostName'] = '';
    await this.updateSlot(slot, 'OPEN');
  }

  /**
   * @description Check for closed slots and set them as being in "closed" invariant state.
   *
   * This is only triggered by scheduled events.
   */
  public async checkForClosed(): Promise<void> {
    const slots = await this.loadSlots();
    const currentTime = this.getCurrentTime();
    const updateSlots = slots.map(async (slot: SlotDTO) => {
      if (currentTime > slot?.timeSlot?.endTime) return await this.updateSlot(slot, 'CLOSED');
    });
    await Promise.all(updateSlots);
  }

  /**
   * @description Check for unattended slots.
   */
  public async checkForUnattended(): Promise<void> {
    const slots = await this.loadSlots();
    const updateSlots = slots.map(async (slot: SlotDTO) => await this.setSlotAsUnattended(slot));
    await Promise.all(updateSlots);
  }

  /**
   * @description Set a slot as being in `OPEN` invariant state if it is unattended.
   *
   * First, checks to see if a reserved slot has not been checked into
   * within 10 minutes (the "grace period").
   *
   * State change can only be performed in `RESERVED` state.
   *
   * This is only triggered by scheduled events.
   *
   * @emits `UNATTENDED`
   */
  public async setSlotAsUnattended(slot: SlotDTO): Promise<void> {
    const currentTime = this.getCurrentTime();
    const gracePeriodEnd = this.getGracePeriodEndTime(slot?.timeSlot?.startTime);
    /**
     * Check if our 10 minute grace period has ended,
     * in which case we want to open the slot again.
     */
    if (currentTime < gracePeriodEnd) return;

    const { slotId, slotStatus, hostName, timeSlot } = slot;
    const { startTime } = timeSlot;

    if (slotStatus !== 'RESERVED') return;

    const newStatus = 'OPEN';
    await this.updateSlot(slot, newStatus);

    const event = new UnattendedEvent({
      event: {
        eventName: 'UNATTENDED', // Transient state
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.emitEvents(event);
  }
}
```
{% endcode %}