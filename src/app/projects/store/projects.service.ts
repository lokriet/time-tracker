import { ID } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessagesService } from 'src/app/messages/store/messages.service';
import { ProjectsStore } from './projects.store';
import { ProjectsQuery } from './projects.query';
import { Observable } from 'rxjs';
import { Project } from '../project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private db: AngularFirestore,
              private messagesService: MessagesService,
              private projectsStore: ProjectsStore,
              private projectsQuery: ProjectsQuery) {}

  initStoreCache(ownerId: string) {
    this.db.collection("projects", ref => ref.where("ownerId", "==", ownerId)).get()
    .subscribe(querySnapshot => {
      let projects: Project[] = [];
      querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          projects.push(<Project>doc.data());
      });
      this.projectsStore.set(projects);
    });
  }

  getProjectsByOwnerId(ownerId: string): Observable<Project[]> {
    if (!this.projectsQuery.getHasCache()) {
      this.initStoreCache(ownerId);
    }
  
    return this.projectsQuery.selectAll({
      filterBy: entity => entity.ownerId === ownerId
    });
  }

  addProject(project: Project) {
    this.projectsStore.add(project);
    this.db.collection('projects').doc(String(project.id)).set(project)
      .then(() => {
        this.messagesService.addInfo("Project created successfully");
      })
      .catch(error => {
        this.messagesService.addError("Failed to create project in database");
        console.log(error);
      });
  }

  updateProject(project: Project) {
    this.projectsStore.update(project.id, {...project});
    this.db.collection('projects').doc(String(project.id)).update(project)
      .then(() => {
          this.messagesService.addInfo("Project updated successfully");
        }
      )
      .catch(error => {
        this.messagesService.addError("Failed to update project in database");
        console.log(error);
      });
  }

  removeProject(id: ID) {
    this.projectsStore.remove(id);
    this.db.collection('projects').doc(String(id)).delete()
      .then(() => {
        this.messagesService.addInfo("Project removed successfully");
      })
      .catch(error => {
        this.messagesService.addError("Failed to remove project from database");
        console.log(error);
      })
  }

  generateId(): ID {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }
}