import { SimpleDate } from './simple-date.model';
import { TimeRange } from './time-range.model';

export class Task {
  id: string;
  taskName: string;
  workDate: SimpleDate;
  workHours: TimeRange;
  breaks: TimeRange[];
}
