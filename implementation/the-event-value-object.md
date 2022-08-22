# The event value object

Description.

## Emitting events

The way we are addressing the events and eventing infrastructure follows this model:

`EventEmitter` -> `EmittableEvent` -> `Event`

&#x20;Let's see it in action:

{% code title="code/Reservation/SlotReservation/src/infrastructure/emitters/EventBridgeEmitter.ts" lineNumbers="true" %}
```typescript
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { EventBridgeEvent } from '../../interfaces/Event';
import { EventEmitter } from '../../interfaces/EventEmitter';

import { MissingEnvVarsError } from '../../application/errors/MissingEnvVarsError';

/**
 * @description Factory function to return freshly minted EventBridge instance.
 */
export const makeNewEventBridgeEmitter = (region: string) => {
  if (!region) throw new MissingEnvVarsError(JSON.stringify([{ key: 'REGION', value: region }]));

  return new EventBridgeEmitter(region);
};

/**
 * @description An EventBridge implementation of the `EventEmitter`.
 */
class EventBridgeEmitter implements EventEmitter {
  eventBridge: any;

  constructor(region: string) {
    this.eventBridge = new EventBridgeClient({ region });
  }

  /**
   * @description Utility to emit events with the AWS EventBridge library.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html
   * @see https://www.npmjs.com/package/@aws-sdk/client-eventbridge
   */
  public async emit(event: EventBridgeEvent): Promise<void> {
    const command = new PutEventsCommand({ Entries: [event] });
    if (process.env.NODE_ENV === 'test') return;
    await this.eventBridge.send(command);
  }
}
```
{% endcode %}

We see that there is a basic Factory there, and then the `EventBridgeEmitter` just implements the overall `EventEmitter` which is just a simple interface so we can create other emitter infrastructure in the future. We want to separate the emitters primarily for testing (and local development) reasons, so that we can use a local mock rather than the full-blown EventBridge client.

## The events

The `EmittableEvent` value object might look long and daunting, but it's actually very simple. The  situation we have to deal with is that the event shape is rather deep meaning it does take some energy to construct it.

{% code title="code/Reservation/SlotReservation/src/domain/valueObjects/Event.ts" lineNumbers="true" %}
```typescript
import { randomUUID } from 'crypto';

import {
  EventInput,
  EventDetail,
  EventBridgeEvent,
  EventDTO,
  MakeEventInput,
  MetadataInput
} from '../../interfaces/Event';
import { Metadata, MetadataConfigInput } from '../../interfaces/Metadata';

import { getCorrelationId } from '../../infrastructure/utils/userMetadata';

import { MissingMetadataFieldsError } from '../../application/errors/MissingMetadataFieldsError';
import { NoMatchInEventCatalogError } from '../../application/errors/NoMatchInEventCatalogError';

/**
 * @description Vend a "Event Carried State Transfer" type event with state
 * that can be emitted with an emitter implementation.
 */
abstract class EmittableEvent {
  event: EventBridgeEvent;
  eventBusName: string;
  metadataConfig: MetadataConfigInput;

  constructor(eventInput: EventInput) {
    const { event, eventBusName, metadataConfig } = eventInput;
    this.eventBusName = eventBusName;
    this.metadataConfig = metadataConfig;

    const eventDTO: EventDTO = this.makeDTO(event);
    this.event = this.make(eventDTO);
  }

  /**
   * @description Make an intermediate Data Transfer Object that
   * contains all required information to vend out a full event.
   */
  private makeDTO(eventInput: MakeEventInput): EventDTO {
    const { eventName, slotId, slotStatus } = eventInput;

    const detailType = this.matchDetailType(eventName);

    return {
      eventBusName: this.eventBusName,
      eventName,
      detailType,
      // @ts-ignore
      metadata: {
        ...this.metadataConfig,
        version: eventInput.version || 1,
        id: randomUUID().toString(),
        correlationId: getCorrelationId()
      },
      data: {
        event: eventName,
        slotId,
        slotStatus,
        hostName: eventInput.hostName || '',
        startTime: eventInput.startTime || ''
      }
    };
  }

  /**
   * @description Produces a fully formed event that can be used with AWS EventBridge.
   */
  private make(eventDto: EventDTO): EventBridgeEvent {
    const { eventBusName, data, metadata, detailType } = eventDto;
    const { version, id, correlationId } = metadata;
    const source = `${metadata.domain?.toLowerCase()}.${metadata.system?.toLowerCase()}.${detailType.toLowerCase()}`;

    const detail: EventDetail = {
      metadata: this.produceMetadata({ version, id, correlationId }),
      data
    };

    return {
      EventBusName: eventBusName,
      Source: source,
      DetailType: detailType,
      Detail: JSON.stringify(detail)
    };
  }

  /**
   * @description Produce correct metadata format for the event.
   * @note The verbose format is used as we cannot make assumptions
   * on users actually passing in fully formed data.
   */
  private produceMetadata(metadataInput: MetadataInput): Metadata {
    const { version, id, correlationId } = metadataInput;

    if (
      !version ||
      !this.metadataConfig.lifecycleStage ||
      !this.metadataConfig.domain ||
      !this.metadataConfig.system ||
      !this.metadataConfig.service ||
      !this.metadataConfig.team
    )
      throw new MissingMetadataFieldsError(metadataInput);

    const timeNow = Date.now();

    return {
      timestamp: new Date(timeNow).toISOString(),
      timestampEpoch: `${timeNow}`,
      id,
      correlationId,
      version,
      lifecycleStage: this.metadataConfig.lifecycleStage,
      domain: this.metadataConfig.domain,
      system: this.metadataConfig.system,
      service: this.metadataConfig.service,
      team: this.metadataConfig.team,
      platform: this.metadataConfig.platform,
      owner: this.metadataConfig.owner,
      region: this.metadataConfig.region,
      jurisdiction: this.metadataConfig.jurisdiction,
      tags: this.metadataConfig.tags,
      dataSensitivity: this.metadataConfig.dataSensitivity
    };
  }

  /**
   * @description Pick out matching `detail-type` field from event names.
   * @note Should be refactored to regex solution if this grows.
   */
  private matchDetailType(eventName: string) {
    switch (eventName) {
      case 'CREATED':
        return 'Created';
      case 'CANCELLED':
        return 'Cancelled';
      case 'RESERVED':
        return 'Reserved';
      case 'CHECKED_IN':
        return 'CheckedIn';
      case 'CHECKED_OUT':
        return 'CheckedOut';
      case 'UNATTENDED':
        return 'Unattended';
    }

    throw new NoMatchInEventCatalogError(eventName);
  }

  /**
   * @description Get event payload.
   */
  public get() {
    return this.event;
  }

  /**
   * @description Return modified DTO variant for analytics purposes.
   * Use "Notification" type event without state.
   */
  public getAnalyticsVariant(analyticsBusName: string): EventBridgeEvent {
    const analyticsEvent = JSON.parse(JSON.stringify(this.get()));
    const detail = JSON.parse(analyticsEvent.Detail);

    analyticsEvent['EventBusName'] = analyticsBusName;
    detail['metadata']['id'] = randomUUID().toString();
    if (detail.data?.slotStatus) delete detail['data']['slotStatus'];

    analyticsEvent['Detail'] = JSON.stringify(detail);

    return analyticsEvent as EventBridgeEvent;
  }
}

/**
 * @description An event that represents the `Created` invariant state.
 */
export class CreatedEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `Cancelled` invariant state.
 */
export class CancelledEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `Reserved` invariant state.
 */
export class ReservedEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `CheckedIn` invariant state.
 */
export class CheckedInEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `CheckedOut` invariant state.
 */
export class CheckedOutEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `Unattended` invariant state.
 */
export class UnattendedEvent extends EmittableEvent {
  //
}
```
{% endcode %}

Admittedly the event structure (despite our decoupling of the emitter itself) is tied to EventBridge that is acceptable as we are actually only using EventBridge in our project. If we would support truly different emitters we would perhaps need to add further abstractions on the event shape. In the context of this project we can accept that as a trivia item.

### Metadata

The `produceMetadata` method does what it says on the box. It's not that complicated but allows us the possibility to vend a metadata object that is always as expected.

### Matching the detail type

Very basic, dumb implementation to match the event name to a recased version.

### DTO

First we make the EventDTO. This has the overall shape we actually require.

### Make method

The `make()` method takes our event DTO and forms it into the EventBridgeEvent that can actually be put on our event bus.

### Get method

In order to use the class (remember, data _and_ behavior!) rather than a dumb plain object, we'll allow a method to access the current representation.

### Get analytics method

Just as the regular `get()` method, the `getAnalyticsVariant()` method returns a representation of the event. The reasons we want to have this as a specific method is:

* The analytics event bus is not the same as the regular one
* We want to redact the (potentially sensitive) ID
* The analytics context does not need the slot status

### Extended classes

There is nothing unique concerning the classes that we should use, so we can contain the "base" class and make trivial extensions to allow use for the derived classes instead.
