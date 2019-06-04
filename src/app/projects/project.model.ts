import { ID } from '@datorama/akita';

export interface Project {
  id: ID,
  ownerId: string,
  projectName: string,
  isPaid: boolean,
  payRate: number
}