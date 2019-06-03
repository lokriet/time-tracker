import { Injectable } from '@angular/core';

import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

import { Task } from '../model/task.model';
import { TasksStore } from './tasks.store';
import { TasksQuery } from './tasks.query';
import { DatabaseService } from 'src/app/db.service';
import { serializeTask, deserializeTask } from '../model/task.serializer';

@Injectable({ providedIn: 'root' })
export class TasksService {
  db: firebase.firestore.Firestore;

  constructor(private tasksStore: TasksStore,
              private tasksQuery: TasksQuery,
              private dbService: DatabaseService) {
              
    this.db = this.dbService.db;
    console.log('initialized tasks service');
    console.log(this.db);
  }

  getTasksByOwnerId(ownerId: string): Observable<Task[]> {
    this.db.collection("tasks").where("ownerId", "==", ownerId).get()
      .then(querySnapshot => {
        let tasks: Task[] = [];
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            
            tasks.push(deserializeTask(doc.data()));
        });
        this.tasksStore.set(tasks);
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    
    
    return this.tasksQuery.selectAll({
      filterBy: entity => entity.ownerId === ownerId
    });
  }

  addTask(task: Task) {
    this.tasksStore.add(task);
  }

  updateTask(task: Task) {
    this.tasksStore.update(task.id, {...task});
  }

  removeTask(id: ID) {
    this.tasksStore.remove(id);
    this.tasksStore.ui.remove(id);
  }

  updateTaskUiState(id: ID, isExpanded: boolean) {
    this.tasksStore.ui.upsert(id, { isExpanded });
  }

  generateId():ID {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }


  storeTasksForOwnerId(ownerId: string) {
    let batch = this.db.batch();

    for (let task of this.tasksQuery.getAll({ filterBy: entity => entity.ownerId === ownerId })) {
      let taskRef = this.db.collection('tasks').doc(String(task.id));
      batch.set(taskRef, serializeTask(task));
    }

    batch.commit()
      .then(
        () => { console.log('saved data successfully');}
      )
      .catch(
       error => {console.log(`Could not save data. Error: ${JSON.stringify(error, null, 2)}`)}
      );
  }
}