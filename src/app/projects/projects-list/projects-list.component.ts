import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faHeart, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faDollarSign, faHeart as faFullHeart } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/store/auth.service';

import { Project } from '../project.model';
import { ProjectsQuery } from '../store/projects.query';
import { ProjectsService } from '../store/projects.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  faDollar = faDollarSign;
  faDelete = faTrashAlt;
  faEdit = faEdit;
  faEmptyHeart = faHeart;
  faFullHeart = faFullHeart;

  projects$: Observable<Project[]>;

  constructor(private projectsService: ProjectsService,
              private projectsQuery: ProjectsQuery,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.projects$ = this.projectsService.getProjectsByOwnerId(this.authService.getCurrentUserUid(), null);
  }

  onEditProject(project: Project) {
    this.router.navigate(['edit', project.id], {relativeTo: this.route});
  }

  onDeleteProject(project: Project) {
    const shouldNavigateAway = this.projectsQuery.getActiveId() == project.id;
    this.projectsService.removeProject(project.id);
    if (shouldNavigateAway) {
      this.router.navigate(['projects']);
    }
  }

  onSwitchFavorite(project: Project) {
    this.projectsService.setProjectIsFavorite(project.id, !project.isFavorite);
  }

}
