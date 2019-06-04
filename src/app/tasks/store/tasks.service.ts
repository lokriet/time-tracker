import { Injectable } from '@angular/core';

import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';

import { Task } from '../model/task.model';
import { TasksStore } from './tasks.store';
import { TasksQuery } from './tasks.query';
import { serializeTask, deserializeTask } from '../model/task.serializer';
import { MessagesService } from 'src/app/messages/store/messages.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private tasksStore: TasksStore,
              private tasksQuery: TasksQuery,
              private db: AngularFirestore,
              private messagesService: MessagesService) {
  }

  getTasksByOwnerId(ownerId: string): Observable<Task[]> {
    if (!this.tasksQuery.getHasCache()) {
      this.db.collection("tasks", ref => ref.where("ownerId", "==", ownerId)).get()
        .subscribe(querySnapshot => {
          let tasks: Task[] = [];
          querySnapshot.forEach(doc => {
              // doc.data() is never undefined for query doc snapshots
              tasks.push(deserializeTask(doc.data()));
          });
          this.tasksStore.set(tasks);
        });
    }
    
    return this.tasksQuery.selectAll({
      filterBy: entity => entity.ownerId === ownerId
    });
  }

  addTask(task: Task) {
    this.tasksStore.add(task);
    this.db.collection('tasks').doc(String(task.id)).set(serializeTask(task))
      .then(() => {
        this.messagesService.addInfo("Task created successfully");
      })
      .catch(error => {
        this.messagesService.addError("Failed to create task in database");
        console.log(error);
      });
  }

  updateTask(task: Task) {
    this.tasksStore.update(task.id, {...task});
    this.db.collection('tasks').doc(String(task.id)).update(serializeTask(task))
      .then(() => {
          this.messagesService.addInfo("Task updated successfully");
        }
      )
      .catch(error => {
        this.messagesService.addError("Failed to update task in database");
        console.log(error);
      });
  }

  removeTask(id: ID) {
    this.tasksStore.remove(id);
    this.tasksStore.ui.remove(id);
    this.db.collection('tasks').doc(String(id)).delete()
      .then(() => {
        this.messagesService.addInfo("Task removed successfully");
      })
      .catch(error => {
        this.messagesService.addError("Failed to remove task from database");
        console.log(error);
      })
  }

  updateTaskUiState(id: ID, isExpanded: boolean) {
    this.tasksStore.ui.upsert(id, { isExpanded });
  }

  generateId():ID {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }

}