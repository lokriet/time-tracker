import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { Project } from '../project.model';

export interface ProjectsState extends EntityState<Project>, ActiveState {}

const initialState = {
  active: null
}

@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'projects', resettable: true})
export class ProjectsStore extends EntityStore<ProjectsState, Project> {
  constructor() {
    super(initialState);
  }
}
