import { Task } from '../shared/task.model';
import { Subject } from 'rxjs';

export class TasksService {
  private tasks: Task[] = [];
  tasksChanged = new Subject<void>();

  getTasks() {
    return this.tasks.slice();
  }

  addTask(task:Task) {
    this.tasks.push(task);
    this.tasksChanged.next();
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
    this.tasksChanged.next();
  }
}