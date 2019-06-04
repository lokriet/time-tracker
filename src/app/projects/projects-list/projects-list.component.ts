import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../project.model';
import { ProjectsService } from '../store/projects.service';
import { AuthService } from 'src/app/auth/store/auth.service';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectsQuery } from '../store/projects.query';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  faDollar = faDollarSign;
  faDelete = faTrashAlt;
  faEdit = faEdit;

  projects$: Observable<Project[]>;

  constructor(private projectsService: ProjectsService,
              private projectsQuery: ProjectsQuery,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.projects$ = this.projectsService.getProjectsByOwnerId(this.authService.getCurrentUserUid());
  }

  onEditProject(project: Project) {
    this.router.navigate(['edit', project.id], {relativeTo: this.route});
  }

  onDeleteProject(project: Project) {
    let shouldNavigateAway = this.projectsQuery.getActiveId() == project.id;
    this.projectsService.removeProject(project.id);
    if (shouldNavigateAway) {
      this.router.navigate(['projects']);
    }
  }

}
