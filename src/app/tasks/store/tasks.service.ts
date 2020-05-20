import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ID } from '@datorama/akita';
import { Project } from 'src/app/projects/project.model';

import { MessagesService } from '../../messages/store/messages.service';
import { Task } from '../model/task.model';
import { TaskSerializer } from '../model/task.serializer';
import { TasksQuery } from './tasks.query';
import { TasksStore } from './tasks.store';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private tasksStore: TasksStore,
              private tasksQuery: TasksQuery,
              private db: AngularFirestore,
              private messagesService: MessagesService,
              private taskSerializer: TaskSerializer) {
  }

  initStoreCache(ownerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.tasksQuery.getHasCache()) {
        this.db.collection('tasks', ref => ref.where('ownerId', '==', ownerId)).get()
        .subscribe(querySnapshot => {
          const tasks: Task[] = [];
          querySnapshot.forEach(doc => {
              // doc.data() is never undefined for query doc snapshots
              tasks.push(this.taskSerializer.deserializeTask(doc.data()));
          });
          this.tasksStore.set(tasks);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  resetStoreCache() {
    this.tasksStore.reset();
    this.tasksStore.ui.reset();
  }

  addTask(task: Task) {
    this.tasksStore.add(task);
    this.db.collection('tasks').doc(String(task.id)).set(this.taskSerializer.serializeTask(task))
      .then(() => {
        this.messagesService.addInfo('Task created successfully');
      })
      .catch(error => {
        this.messagesService.addError('Failed to create task in database');
        // console.log(error);
      });
  }

  updateTask(task: Task) {
    this.tasksStore.update(task.id, {...task});
    this.db.collection('tasks').doc(String(task.id)).update(this.taskSerializer.serializeTask(task))
      .then(() => {
          this.messagesService.addInfo('Task updated successfully');
        }
      )
      .catch(error => {
        this.messagesService.addError('Failed to update task in database');
        // console.log(error);
      });
  }

  removeTask(id: ID) {
    this.tasksStore.remove(id);
    this.tasksStore.ui.remove(id);
    this.db.collection('tasks').doc(String(id)).delete()
      .then(() => {
        this.messagesService.addInfo('Task removed successfully');
      })
      .catch(error => {
        this.messagesService.addError('Failed to remove task from database');
        // console.log(error);
      })
  }

  updateTaskUiState(id: ID, isExpanded: boolean) {
    this.tasksStore.ui.upsert(id, { isExpanded });
  }

  updateTasksWithProject(project: Project) {
    const tasks = this.tasksQuery.getAll({filterBy: task => task.project.id === project.id});
    for (let task of tasks) {
      this.tasksStore.update(task.id, {project});
    }
  }

  generateId(): ID {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }

}
