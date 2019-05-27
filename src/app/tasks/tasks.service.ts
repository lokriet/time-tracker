import { Task } from '../shared/task.model';
import { Subject } from 'rxjs';
import { Time } from '../shared/time.model';
import { TimeRange } from '../shared/time-range.model';

export class TasksService {
  private tasks: Task[] = [
    {
      id: 'JW5NY3D8RLWHL',
      taskName: 'work',
      workDate: {
        day: 1,
        month: 1,
        year: 2019
      },
      workHours: new TimeRange(
        Time.fromString('11:00am'),
        Time.fromString('8:00pm'),
        false),
      breaks: [
        new TimeRange(
          Time.fromString('1:00pm'),
          Time.fromString('1:30pm'),
          false
        )
      ]
    }
  ];
  tasksChanged = new Subject<void>();

  getTasks() {
    return this.tasks.slice();
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.tasksChanged.next();
  }

  updateTask(task: Task) {
    if (!this.tasks.some((nextTask: Task) => nextTask.id == task.id)) {
      throw new Error(`Couldn't update task, no task with id ${task.id}`);
    } 

    this.tasks = this.tasks.map((nextTask: Task) => {
      if (nextTask.id == task.id) {
        return task;
      } else {
        return nextTask;
      }
    });
    this.tasksChanged.next();
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter((task: Task) => {task.id != id});
    this.tasksChanged.next();
  }

  getTaskById(id: string) {
    return this.tasks.find((task: Task) => task.id == id);
  }

  generateId():string {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }
}