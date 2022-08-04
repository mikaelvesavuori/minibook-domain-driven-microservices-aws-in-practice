# Clean architecture-style use cases

Example:

```typescript
import { Dependencies } from '../../interfaces/Dependencies';
import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';

/**
 * @description Add record to database.
 */
export async function AddRecordUseCase(dependencies: Dependencies, record: AnalyticalRecord) {
  const { repository } = dependencies;
  await repository.add(record);
}
```
