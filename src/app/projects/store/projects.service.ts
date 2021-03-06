import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ID, Order } from '@datorama/akita';
import { Observable } from 'rxjs';
import { MessagesService } from 'src/app/messages/store/messages.service';
import { TasksService } from 'src/app/tasks/store/tasks.service';

import { Project } from '../project.model';
import { ProjectsQuery } from './projects.query';
import { ProjectsStore } from './projects.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private db: AngularFirestore,
              private messagesService: MessagesService,
              private projectsStore: ProjectsStore,
              private projectsQuery: ProjectsQuery,
              private tasksService: TasksService) {}

  initStoreCache(ownerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.projectsQuery.getHasCache()) {
        this.db.collection('projects', ref => ref.where('ownerId', '==', ownerId)).get()
        .subscribe(querySnapshot => {
          const projects: Project[] = [];
          querySnapshot.forEach(doc => {
              // doc.data() is never undefined for query doc snapshots
              projects.push(doc.data() as Project);
          });
          this.projectsStore.set(projects);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  resetStoreCache() {
    this.projectsStore.reset();
  }

  getProjectsByOwnerId(ownerId: string, sortBy: any, sortByOrder = Order.ASC): Observable<Project[]> {
    if (!this.projectsQuery.getHasCache()) {
      this.initStoreCache(ownerId);
    }

    return this.projectsQuery.selectAll({
      filterBy: entity => entity.ownerId === ownerId,
      sortBy, sortByOrder
    });
  }

  addProject(project: Project) {
    this.projectsStore.add(project);
    this.db.collection('projects').doc(String(project.id)).set(project)
      .then(() => {
        this.messagesService.addInfo('Project created successfully');
      })
      .catch(error => {
        this.messagesService.addError('Failed to create project in database');
        // console.log(error);
      });
  }

  updateProject(project: Project) {
    this.projectsStore.update(project.id, {...project});
    this.tasksService.updateTasksWithProject(project);
    this.db.collection('projects').doc(String(project.id)).update(project)
      .then(() => {
          this.messagesService.addInfo('Project updated successfully');
        }
      )
      .catch(error => {
        this.messagesService.addError('Failed to update project in database');
        // console.log(error);
      });
  }

  setProjectIsFavorite(id: ID, isFavorite: boolean) {
    this.projectsStore.update(id, {isFavorite});
    this.db.collection('projects').doc(String(id)).update(this.projectsQuery.getEntity(id))
      .then(() => {
          this.messagesService.addInfo('Project updated successfully');
        }
      )
      .catch(error => {
        this.messagesService.addError('Failed to update project in database');
        // console.log(error);
      });
  }

  removeProject(id: ID) {
    this.projectsStore.remove(id);
    this.db.collection('projects').doc(String(id)).delete()
      .then(() => {
        this.messagesService.addInfo('Project removed successfully');
      })
      .catch(error => {
        this.messagesService.addError('Failed to remove project from database');
        // console.log(error);
      })
  }

  generateId(): ID {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }
}
