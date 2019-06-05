import { Component, OnInit } from '@angular/core';

import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { colorSets } from '@swimlane/ngx-charts/release/utils';

import { TasksQuery } from '../tasks/store/tasks.query';
import { Task } from '../tasks/model/task.model';
import { getTaskLength } from '../tasks/model/time-formatter.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  data: any;
  scheme: any;

  constructor(private tasksQuery: TasksQuery,
              private calendar: NgbCalendar) { }

  ngOnInit() {
    this.scheme = colorSets.find(s => s.name === 'vivid');

    let tomorrow = this.calendar.getNext(this.calendar.getToday(), "d", 1);
    let weekAndADayAgo = this.calendar.getPrev(this.calendar.getToday(), "d", 8);
    let tasks = this.tasksQuery.getAll({filterBy: (task:Task) => tomorrow.after(task.workDate) && weekAndADayAgo.before(task.workDate)});

    this.data = [];

    let date = this.calendar.getToday();
    let index = 0;
    while (date.after(weekAndADayAgo)) {
      let dataItemName = date.year + "/" + date.month + "/" + date.day;
      let dataSeriesMap = new Map<string, number>();
      while ((tasks.length > index) && date.before(tasks[index].workDate)) {
        index++;
      }
      while ((tasks.length > index) && date.equals(tasks[index].workDate)) {
        if (dataSeriesMap.has(projectName(tasks[index]))) {
          dataSeriesMap.set(projectName(tasks[index]), 
                            dataSeriesMap.get(projectName(tasks[index])) + taskLength(tasks[index]));
        } else {
          dataSeriesMap.set(projectName(tasks[index]), taskLength(tasks[index]));
        }
        index++;
      }

      let dataSeries = [];
      for (let dataSeriesEntry of dataSeriesMap.entries()) {
        dataSeries.push({name: dataSeriesEntry[0], value: dataSeriesEntry[1]});
      }

      this.data.unshift({name: dataItemName, series: dataSeries});
      date = this.calendar.getPrev(date, "d", 1);
    }

    /*this.data = [
      {
        name: "2019/05/30",
        series: [
          {
            name: "work",
            value: 2.5
          },
          {
            name: "study",
            value: 8
          }
        ]
      },
      {
        name: "2019/05/31",
        series: []
      },
      {
        name: "2019/06/02",
        series: [
          {
            name: "work",
            value: 7
          },
          {
            name: "sleep",
            value: 4.5
          }
        ]
      }
    ]*/
  }


  
}
function projectName(task: Task):string {
  if (task.project) {
    return task.project.projectName;
  }
  return "no project";
}

function taskLength(task: Task):number {
  let taskLengthInMillis = getTaskLength(task);
  let taskLengthInHours = taskLengthInMillis / (1000 * 60 * 60);
  return taskLengthInHours;
}
