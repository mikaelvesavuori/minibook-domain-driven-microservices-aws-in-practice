/**
 * @description The Repository allows us to access a database of some kind.
 */
export interface Repository {
  /**
   * @description Get data from source system.
   */
  getData(dataRequest: DataRequest): Promise<any>;
}

export type DataRequest = {
  key: string;
  onlyGetCount?: boolean;
  getLastDeployedCommit?: boolean;
  days?: number;
};
