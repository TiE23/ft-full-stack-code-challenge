export interface DeleteResult {
  affected?: number;
  raw: any;
}

export enum EntityType {
  CATEGORY = 'Category',
  TASK = 'Task',
}
