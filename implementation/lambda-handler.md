---
description: >-
  The handler isn't sacred, it's just infrastructure. Doing the handler right
  affords us portability and decoupling from our implementation.
---

# Lambda handler

<figure><img src="../.gitbook/assets/CA + DDD selected 2.png" alt=""><figcaption><p>Handlers (a type of controller) reside in the Adapter layer.</p></figcaption></figure>

As I wrote in one of the introductory chapters, a relatively common "misimplementation" is to think of the Lambda handler is the _full extent_ of the function. This is all straightforward in trivial contexts, but we gain a significant improvement by being able to remove the pure setup and boilerplate from the business side of things.

The semantic concept of "handler" is somewhat particular to have we talk about _function handlers_ or _event handlers_. On a more generic software architecture note, this layer could often be translated into what goes into the "controller" term in the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) school. I've been known to use the "controller" term and set a dedicated folder in the structure at an earlier stage in my career, but I now refrain from it and go with "[adapters](https://alistair.cockburn.us/hexagonal-architecture/)" instead, simply as its an ever wider concept and since we now open for _any_ type of driver of our functions.

Enough introduction, let's go ahead and look at a handler:

{% code title="code/Reservation/Reservation/src/infrastructure/adapters/web/ReserveSlot.ts" lineNumbers="true" %}
```typescript
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { ReserveSlotUseCase } from '../../../application/usecases/ReserveSlotUseCase';

import { MissingRequestBodyError } from '../../../application/errors/MissingRequestBodyError';
import { UnsupportedVersionError } from '../../../application/errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getVersion } from '../../utils/getVersion';
import { setCorrelationId } from '../../utils/userMetadata';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Reserve a slot.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: 'ReserveSlot' },
      event,
      context
    });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    const body: Record<string, string | number> =
      typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    if (!body || JSON.stringify(body) === '{}') throw new MissingRequestBodyError();
    const slotId = body.id as string;
    const hostName = body.host as string;

    setCorrelationId(event, context);

    const dependencies = setupDependencies(metadataConfig('ReserveSlot'));

    const response = await ReserveSlotUseCase(dependencies, {
      slotId,
      hostName
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}
```
{% endcode %}

At the top we get the imports, nothing much to add there, and we see that the handler is exported as an async function. This is per Lambda convention.

### Handling the API/event input

I've been somewhat loose on the parameters, as the `event` is just any old Record (object) but the `context` is an actual typed AWS context object. This is up for opinion, sure, but I find that the event itself is just easier to deal with when it is untyped and because its structure may significantly change based on which integration mechanism is used—in our case, if it's via API Gateway or EventBridge. The ensure this doesn't blow up or bloat _all_ of our functions in this service we've made a small `getDTO()` utility function to accurately piece together a fully formed Data Transfer Object from the input. Because it's a utility and not business-oriented we want to avoid any deep considerations or logic in that function, as seen below:

{% code title="code/Analytics/SlotAnalytics/src/infrastructure/utils/getDTO.ts" lineNumbers="true" %}
```typescript
import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';

/**
 * @description Utility function to get data transfer object from either event or request payload.
 */
export function getDTO(event: Record<string, any>): AnalyticalRecord | void {
  if (!event) return;

  // Match for EventBridge case
  if (event?.detail) return createEventBridgeDto(event);

  // Match for typical API GW input
  const body = event.body && typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  if (body) return createApiGatewayDto(body);
  else return;
}

function createEventBridgeDto(event: any) {
  return {
    id: event?.detail?.metadata?.id || '',
    correlationId: event?.detail?.metadata?.correlationId || '',
    event: event?.detail?.data?.event || '',
    slotId: event?.detail?.data?.slotId || '',
    startsAt: event?.detail?.data?.startTime || '',
    hostName: event?.detail?.data?.hostName || ''
  };
}

function createApiGatewayDto(body: any) {
  return {
    id: body.id || '',
    correlationId: body.correlationId || '',
    event: body.event || '',
    slotId: body.slotId || '',
    startsAt: body.startTime || '',
    hostName: body.hostName || ''
  };
}

```
{% endcode %}

We use the Data Transfer Object, or DTO, simply to carry around a representation of data. We could call this object `Input` or something if we wanted, but I'll keep it simply as `data` here.

Back in the handler, you'll see that we start a logger (`MikroLog` ) so that it's available during our complete function duration (we never know when and if something breaks so let's do that setup at first thing!). See this as the right place for you to set up any other similar components if you have any.

Note also how we wrap the outer perimeter of the handler—being the first thing that is run, after all—in a `try/catch` block. This ensures that we can respond back on the main cases: "All is well", or "it's a dumpster fire". More complex examples could absolutely be dynamic and set things like the error code dependent on the error. Once again, here we are keeping at the fundamentals.

### Using unique errors/exceptions

On line 20 we have:

```typescript
if (!data) throw new MissingDataFieldsError();
```

We throw a unique exception (or error) based on the lack of data. Unique errors/exceptions is a good thing to start using, as it also means we can set "identities" on all the failure modes of our application.

### Dependency inversion and injection

On lines 22 and 24 the magic starts happening:

```typescript
const dependencies = setupDependencies();

await AddRecordUseCase(dependencies, data);
```

Notice that there's a dedicated utility function `setupDependencies()` to create various required dependencies. For this particular service, we need only a database.

{% code title="code/Analytics/SlotAnalytics/src/infrastructure/utils/setupDependencies.ts" lineNumbers="true" %}
```typescript
import { Dependencies } from '../../interfaces/Dependencies';

import { createNewDynamoDbRepository } from '../repositories/DynamoDbRepository';
import { makeNewLocalRepository } from '../repositories/LocalRepository';

/**
 * @description Utility that returns a complete dependencies object
 * based on implementations either "real" infrastructure or mocked ones.
 */
export function setupDependencies(localUse = false): Dependencies {
  const repository = localUse ? makeNewLocalRepository() : createNewDynamoDbRepository();

  return {
    repository
  };
}

```
{% endcode %}

In the other services we use this same pattern but sometimes return more objects depending on the exact needs. In this case we are receiving either the mock database (for testing and development) or we are getting an instance of DynamoDB. This means we are encapsulating the logic for when we testing, rather than spreading this across everything—note that there are still places where we do need to interact prior to tests, but this is the most important bit.

Why bother with this at all? Well, pretty easy. If we want to follow Uncle Bob's Clean Architecture, as well as following the [D](https://en.wikipedia.org/wiki/Dependency\_inversion\_principle) in [SOLID](https://en.wikipedia.org/wiki/SOLID), we have to bring lower-level (more concrete; more volatile; less business-oriented) components _into_ those that are more business oriented. The magic disconnection we want to create between the infrastructural components (like the database or repository) and the actual use case is now in place.

Note how we just run the use case, injecting it with a set of dependencies making it very easy to replicate and test. We call this pattern [dependency injection](https://en.wikipedia.org/wiki/Dependency\_injection) (DI)—more specifically some havS called the approach used here as "poor man's DI" or "pure DI". In my opinion it's just the way that makes most sense: It adds no dependencies, it's easy to use, and it is completely non-magical. You have this [opinion echoed by people like Khalil Stemmler](https://khalilstemmler.com/articles/software-design-architecture/coding-without-di-container/) as well.

Finally, the correct place to set this "object graph" of dependencies is in what is called the "[composition root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)", which in our case is the handler function, just like we see it being used here.

### In closing

So if all these smart patterns are already happening in the handler, are there any bells and whistles left? There sure are! What's happening in the handler is, no matter how you slice it, completely infrastructural boilerplate. While the `getDTO()` function might need to, well, know, what you actually want, there just isn't that much "business logic" going here.

Wiring up your handlers this way allows you to be very nimble and totally divorce the connection between the _use case_ that orchestrates business logic, and the boilerplate needed to ensure basic conformity with the handler, it's API, and all of that. Using DI we also make future testing a lot easier as we can drive the use case with any repository or other dependencies we want.

All in all, for some this might have been obvious and for others this might be eye-opening, but if nothing else, I definitely saw my own code improve alot when I started using these patterns.

Next up: Testing!
