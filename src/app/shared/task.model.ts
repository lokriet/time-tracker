import { SimpleDate } from './simple-date.model';
import { TimeRange } from './time-range.model';

export class Task {
  taskName: string
  workDate: SimpleDate;
  workHours: TimeRange;
  breaks: TimeRange[];
}
