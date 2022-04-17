import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import { Repository, DataRequest } from '../interfaces/Repository';

const docClient = new DynamoDBClient({
  region: process.env.REGION || 'eu-north-1'
});
const TABLE_NAME = process.env.TABLE_NAME || 'data-platform-demo';

/**
 * @description Factory function to create a DynamoDB repository.
 */
export function createNewDynamoRepository() {
  return new DynamoRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class DynamoRepository implements Repository {
  cache: Record<string, unknown>;

  constructor() {
    this.cache = {};
  }

  /**
   * @description Get data from local cache.
   */
  public getCachedData(key: string): Record<string, unknown> | undefined {
    const cachedData: any = this.cache[key];
    if (cachedData) {
      console.log('Returning cached data...');
      return JSON.parse(cachedData);
    }
    return undefined;
  }

  /**
   * @description Get data from source system.
   */
  public async getData(dataRequest: DataRequest): Promise<any> {
    const { key, onlyGetCount, getLastDeployedCommit, days } = dataRequest;

    // Check cache first
    const cachedData = this.getCachedData(key);
    if (cachedData) return onlyGetCount ? cachedData.length : cachedData;

    const milliseconds = (() => {
      const millisSingleDay = 24 * 60 * 60 * 1000; // hours x minutes x seconds x milliseconds per second

      /**
       * Data was not cached, so go and get fresh data
       * For practical reasons, so tests won't get stale over time, get broader range if this is a test.
       */
      if (process.env.IS_TEST) return millisSingleDay * 1000;

      return millisSingleDay * (days || 30); // Normally, just get the last 30 days
    })();

    /**
     * Only fetch days within our time window (30 days).
     * Use a project expression to cut back on unnecessary data transfer.
     * Fetch even less data if "onlyGetCount" is true.
     * Get by "lastDeployedCommit" value if "getLastDeployedCommit" is true.
     */
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'eventType = :eventType AND timeCreated >= :timeCreated',
      ProjectionExpression: onlyGetCount
        ? 'eventType, timeCreated'
        : 'eventType, timeCreated, timeResolved, id, changes',
      ExpressionAttributeValues: {
        ':eventType': { S: key },
        ':timeCreated': {
          S: getLastDeployedCommit ? 'lastDeployedCommit' : (Date.now() - milliseconds).toString()
        }
      }
    };

    const data = await docClient.send(new QueryCommand(params));

    // Return item count if that's the only thing user wants
    if (onlyGetCount) return data?.Count || 0;

    // Clean up data objects
    const items = this.getCleanedItems(data?.Items as any);

    // Set cache
    this.cache[key] = JSON.stringify(items);

    return items;
  }

  /**
   * @description Clean up and return items in a normalized format.
   */
  private getCleanedItems(items: any[]) {
    const fixedItems: any = [];

    if (items && typeof items === 'object' && items.length > 0) {
      try {
        items.forEach((item: any) => {
          const cleanedItem = {};

          Object.entries(item).forEach((entry: any) => {
            const [key, value] = entry;
            // @ts-ignore
            cleanedItem[key] = Object.values(value)[0];
          });

          fixedItems.push(cleanedItem);
        });
      } catch (error: any) {
        console.error(error);
        throw new Error(error);
      }
    }

    return fixedItems;
  }
}
