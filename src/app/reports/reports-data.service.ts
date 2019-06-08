import { Injectable } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { Task } from '../tasks/model/task.model';
import { getTaskLength } from '../tasks/model/time-formatter.service';
import { TasksQuery } from '../tasks/store/tasks.query';

@Injectable({
  providedIn: 'root'
})
export class ReportsDataService {
  constructor(private tasksQuery: TasksQuery,
              private calendar: NgbCalendar) {

    }

    getMoneyReportData(reportFromDate: NgbDate, reportToDate: NgbDate): any[] {
      const afterLast = this.calendar.getNext(reportToDate, 'd', 1);
      const beforeFirst = this.calendar.getPrev(reportFromDate, 'd', 1);
      const tasks = this.tasksQuery.getAll({
          filterBy: (task: Task) => afterLast.after(task.workDate) && beforeFirst.before(task.workDate)
      });

      const data = [];

      let date = reportToDate;
      let index = 0;
      while (date.after(beforeFirst)) {
        const dataItemName = date.year + '/' + date.month + '/' + date.day;
        const dataSeriesMap = new Map<string, number>();
        while ((tasks.length > index) && date.before(tasks[index].workDate)) {
          index++;
        }
        while ((tasks.length > index) && date.equals(tasks[index].workDate)) {
          if (!!tasks[index].project && tasks[index].project.isPaid) {
            if (dataSeriesMap.has(this.projectName(tasks[index]))) {
              dataSeriesMap.set(this.projectName(tasks[index]),
                                dataSeriesMap.get(this.projectName(tasks[index])) + this.taskWorth(tasks[index]));
            } else {
              dataSeriesMap.set(this.projectName(tasks[index]), this.taskWorth(tasks[index]));
            }
          }
          index++;
        }

        const dataSeries = [];
        dataSeriesMap.forEach(
          (dataSeriesValue: number, dataSeriesName: string) => {
            dataSeries.push({name: dataSeriesName, value: dataSeriesValue});
          });

        data.unshift({name: dataItemName, series: dataSeries});
        date = this.calendar.getPrev(date, 'd', 1);
      }

      return data;
    }

    getHoursReportData(reportFromDate: NgbDate, reportToDate: NgbDate): any[] {
      const afterLast = this.calendar.getNext(reportToDate, 'd', 1);
      const beforeFirst = this.calendar.getPrev(reportFromDate, 'd', 1);
      const tasks = this.tasksQuery.getAll({
          filterBy: (task: Task) => afterLast.after(task.workDate) && beforeFirst.before(task.workDate)
      });

      const data = [];

      let date = reportToDate;
      let index = 0;
      while (date.after(beforeFirst)) {
        const dataItemName = date.year + '/' + date.month + '/' + date.day;
        const dataSeriesMap = new Map<string, number>();
        while ((tasks.length > index) && date.before(tasks[index].workDate)) {
          index++;
        }
        while ((tasks.length > index) && date.equals(tasks[index].workDate)) {
          if (dataSeriesMap.has(this.projectName(tasks[index]))) {
            dataSeriesMap.set(this.projectName(tasks[index]), 
                              dataSeriesMap.get(this.projectName(tasks[index])) + this.taskLength(tasks[index]));
          } else {
            dataSeriesMap.set(this.projectName(tasks[index]), this.taskLength(tasks[index]));
          }
          index++;
        }

        const dataSeries = [];
        dataSeriesMap.forEach(
          (dataSeriesValue: number, dataSeriesName: string) => {
            dataSeries.push({name: dataSeriesName, value: dataSeriesValue});
          });

        data.unshift({name: dataItemName, series: dataSeries});
        date = this.calendar.getPrev(date, 'd', 1);
      }

      return data;
    }


    private taskLength(task: Task): number {
      const taskLengthInMillis = getTaskLength(task);
      const taskLengthInHours = taskLengthInMillis / (1000 * 60 * 60);
      return taskLengthInHours;
    }

    private taskWorth(task: Task): number {
      const taskLength = this.taskLength(task);
      return taskLength * task.project.payRate;
    }

    private projectName(task: Task): string {
      if (!!task.project) {
        return task.project.projectName;
      }
      return 'no project';
    }
}
