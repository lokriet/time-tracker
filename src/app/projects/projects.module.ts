import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditProjectComponent } from './edit-project/edit-project.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProjectsComponent } from './projects.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  declarations: [
    EditProjectComponent,
    ProjectsListComponent, 
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ProjectsRoutingModule
  ],
  exports: [

  ]
})
export class ProjectsModule { }
