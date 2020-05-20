import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';

import { Task } from '../tasks/model/task.model';
import { getTaskLength } from '../tasks/model/time-formatter.service';
import { TasksQuery } from '../tasks/store/tasks.query';

export interface ReportFilters {
  projects: ID[];
}

export interface DataEntry {
  name: string;
  series: {
    name: string;
    value: number;
  }[];
}

export function formatHours(hours: number): string {
  const hoursNo = Math.floor(hours);
  const minutesNo = Math.round((hours - hoursNo) * 60);
  let result = '';
  if (hoursNo > 0) {
    result = hoursNo + 'h';
    if (minutesNo > 0) {
      result += ' ';
    }
  }
  if (minutesNo > 0) {
    result += minutesNo + 'm';
  }
  if (result === '') {
    result = '0';
  }
  return result;
}



@Injectable({
  providedIn: 'root'
})
export class ReportsDataService {
  constructor(private tasksQuery: TasksQuery) {

  }

//   /*
//   [
//     {
//       "name": "2019/6/10",
//       "series": []
//     },
//     {
//       "name": "2019/6/11",
//       "series": [
//         {
//           "name": "work",
//           "value": 119
//         }
//         {
//           "name": "meow",
//           "value": 2.5
//         }
//       ]
//     }
//   ]
//   */
  getMoneyBarReportData(reportFromDate: Date, reportToDate: Date, reportFilters: ReportFilters): DataEntry[] {
    const tasks = this.tasksQuery.getAll({
      filterBy: (task: Task) => reportToDate.getTime() >= task.workDate.getTime() &&
                                reportFromDate.getTime() <= task.workDate.getTime() &&
                                this.filtersApply(task, reportFilters)
    });

    const data = [];

    const date = new Date(reportToDate);
    let index = 0;
    while (date.getTime() >= reportFromDate.getTime()) {
      const dataItemName = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      const dataSeriesMap = new Map<string, number>();
      while ((tasks.length > index) && date.getTime() < tasks[index].workDate.getTime()) {
        index++;
      }
      while ((tasks.length > index) && date.getTime() === tasks[index].workDate.getTime()) {
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
      date.setDate(date.getDate() - 1);
    }

    return data;
  }

//   /*
//   [
//     {
//       "name": "2019/6/10",
//       "series": [
//         {
//           "name": "study",
//           "value": 9.5
//         }
//       ]
//     },
//     {
//       "name": "2019/6/11",
//       "series": [
//         {
//           "name": "work",
//           "value": 8.5
//         },
//         {
//           "name": "sleep",
//           "value": 8
//         }
//       ]
//     }
//   ]
//   */
  getHoursBarReportData(reportFromDate: Date, reportToDate: Date, reportFilters: ReportFilters): DataEntry[] {
    const tasks = this.tasksQuery.getAll({
      filterBy: (task: Task) => reportToDate.getTime() >= task.workDate.getTime() &&
                                reportFromDate.getTime() <= task.workDate.getTime() &&
                                this.filtersApply(task, reportFilters)
    });

    const data = [];

    const date = new Date(reportToDate);
    let index = 0;
    while (date.getTime() >= reportFromDate.getTime()) {
      const dataItemName = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      const dataSeriesMap = new Map<string, number>();
      while ((tasks.length > index) && date.getTime() < tasks[index].workDate.getTime()) {
        index++;
      }
      while ((tasks.length > index) && date.getTime() === tasks[index].workDate.getTime()) {
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
      date.setDate(date.getDate() - 1);
    }

    return data;
  }


//   /*
//   [
//     {
//       "name": "Money earned",
//       "series": [
//         {
//           "name": "2019/6/11",
//           "value": 119
//         }
//         {
//           "name": "2019/6/12",
//           "value": 2.5
//         }
//         {
//           "name": "2019/6/13",
//           "value": 0
//         }
//       ]
//     }
//   ]
//   */
  getMoneyLineReportData(reportFromDate: Date, reportToDate: Date, reportFilters: ReportFilters): DataEntry[] {
    const tasks = this.tasksQuery.getAll({
      filterBy: (task: Task) => reportToDate.getTime() >= task.workDate.getTime() &&
                                reportFromDate.getTime() <= task.workDate.getTime() &&
                                this.filtersApply(task, reportFilters)
    });

    const data = [];
    const dataItemName = 'Money earned';
    const dataSeries = [];

    const date = new Date(reportToDate);
    let index = 0;
    while (date.getTime() >= reportFromDate.getTime()) {
      const seriesItemName = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      let currentDaySum = 0;

      while ((tasks.length > index) && date.getTime() < tasks[index].workDate.getTime()) {
        index++;
      }

      while ((tasks.length > index) && date.getTime() === tasks[index].workDate.getTime()) {
        if (!!tasks[index].project && tasks[index].project.isPaid) {
          currentDaySum += this.taskWorth(tasks[index]);
        }
        index++;
      }
      dataSeries.unshift({name: seriesItemName, value: currentDaySum});

      date.setDate(date.getDate() - 1);
    }

    data.push({name: dataItemName, series: dataSeries});

    return data;
  }

  getBarReportDataTotals(reportData: DataEntry[]) {
    const totalsMap = new Map<string, number>();
    for (const dataEntry of reportData) {
      for (const seriesEntry of dataEntry.series) {
        if (totalsMap.has(seriesEntry.name)) {
          totalsMap.set(seriesEntry.name, totalsMap.get(seriesEntry.name) + seriesEntry.value);
        } else {
          totalsMap.set(seriesEntry.name, seriesEntry.value);
        }
      }
    }

    const results = [];
    totalsMap.forEach((totalsValue: number, totalsName: string) => {
      results.push({name: totalsName, value: totalsValue});
    });
    return results;
  }

  private filtersApply(task: Task, filters: ReportFilters): boolean {
    if (filters && filters.projects && filters.projects.length > 0) {
      let taskProjectId = null;
      if (task.project) {
        taskProjectId = task.project.id;
      }
      return filters.projects.includes(taskProjectId);
    }
    return true;
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

 formatDate(dateString: string): string {
    const datePattern = /^(\d+)\/(\d+)\/(\d+)$/gi;

    const [_, year, month, day] = datePattern.exec(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const date = new Date(+year, +month - 1, +day);
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + weekdays[date.getDay()];
  }
}
