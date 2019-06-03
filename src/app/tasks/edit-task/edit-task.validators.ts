import { ValidatorFn, FormGroup, ValidationErrors, FormArray } from "@angular/forms";

import { Time } from 'src/app/tasks/model/time.model';
import { TimeRange } from 'src/app/tasks/model/time-range.model';

export const timeRangesValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const workHours: TimeRange = control.get('workHours').value;
  const breaks: TimeRange[] = (<FormArray>control.get('breaks')).value;

  if (workHours && breaks) {
    for (let taskBreak of <TimeRange[]>breaks) {
      if (taskBreak) {
        if (!isInRange(taskBreak.startTime, workHours) || !isInRange(taskBreak.endTime, workHours)) {
          return {'breakTimeOutsideOfWorkHours': true};
        }

        for (let innerLoopTaskBreak of <TimeRange[]>breaks) {
          if (innerLoopTaskBreak && taskBreak !== innerLoopTaskBreak) {
            if (isInRange(taskBreak.startTime, innerLoopTaskBreak) || isInRange(taskBreak.endTime, innerLoopTaskBreak)) {
              return {'breakTimesIntersect': true}
            }
          }
        }
      }
    }
  }

  return null;
};

function isInRange(time: Time, timeRange: TimeRange):boolean {
  return (time.date.getTime() > timeRange.startTime.date.getTime()) && (time.date.getTime() < timeRange.endTime.date.getTime());
}