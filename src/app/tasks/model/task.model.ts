import { TimeRange } from './time-range.model';
import { ID } from '@datorama/akita';
import { Project } from 'src/app/projects/project.model';

export class Task {
  id: ID;
  ownerId: string;
  description: string;
  project: Project;
  workDate: Date;
  workHours: TimeRange;
  breaks: TimeRange[];
}

export function createTask({ id, ownerId, description, project, workDate, workHours, breaks }: Partial<Task>) {
  return {
    id,
    ownerId,
    description,
    project,
    workDate,
    workHours,
    breaks
  } as Task;
}