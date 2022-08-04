# Lambda handler

A relatively common "misimplementation" is to think of the Lambda handler is the _full extent_ of the function. This is all straightforward in trivial contexts, but we gain a significant improvement by being able to remove the pure setup and boilerplate from the business side of things.

Example:

{% code title="code/Analytics/SlotAnalytics/src/infrastructure/adapters/web/AddRecord.ts" lineNumbers="true" %}
```typescript
import { Context } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { AddRecordUseCase } from '../../../application/usecases/AddRecordUseCase';

import { MissingDataFieldsError } from '../../../application/errors/MissingDataFieldsError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getDTO } from '../../utils/getDTO';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Add an analytical record.
 */
export async function handler(event: Record<string, any>, context: Context): Promise<any> {
  try {
    MikroLog.start({ metadataConfig: { ...metadataConfig, service: 'AddRecord' }, event, context });
    const data = getDTO(event);
    if (!data) throw new MissingDataFieldsError();

    const dependencies = setupDependencies();

    await AddRecordUseCase(dependencies, data);

    return {
      statusCode: 204,
      body: ''
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
