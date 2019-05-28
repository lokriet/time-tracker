import { SimpleDate } from './simple-date.model';
import { TimeRange } from './time-range.model';
import { ID } from '@datorama/akita';

export class Task {
  id: ID;
  taskName: string;
  workDate: SimpleDate;
  workHours: TimeRange;
  breaks: TimeRange[];
}

export function createTask({ id, taskName, workDate, workHours, breaks }: Partial<Task>) {
  return {
    id,
    taskName,
    workDate,
    workHours,
    breaks
  } as Task;
}