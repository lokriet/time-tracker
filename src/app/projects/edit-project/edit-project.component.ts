import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faHeart as faFullHeart, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../../auth/store/auth.service';
import { Project } from '../project.model';
import { ProjectsQuery } from '../store/projects.query';
import { ProjectsService } from '../store/projects.service';
import { ProjectsStore } from '../store/projects.store';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit, OnDestroy {
  faCheck = faCheck;
  faReload = faSyncAlt;
  faEmptyHeart = faHeart;
  faFullHeart = faFullHeart;

  projectForm: FormGroup;
  editMode = false;

  constructor(private projectsService: ProjectsService,
              private projectsStore: ProjectsStore,
              private projectsQuery: ProjectsQuery,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.projectsStore.setActive(params.id);
        const project = this.projectsQuery.getActive();
        if (params.id != null && !project) {
          // task not found
          this.router.navigate(['/404']);
        }

        this.initForm(project);
      }
    );
  }

  private initForm(project: Project) {
    let id = this.projectsService.generateId();
    let ownerId = this.authService.getCurrentUserUid();
    let projectName = '';
    let isPaid = false;
    let payRate = null;
    let isFavorite = false;

    this.editMode = (project != null);

    if (this.editMode) {
      ({id, ownerId, projectName, isPaid, payRate, isFavorite} = project);
    }

    this.projectForm = new FormGroup({
      id: new FormControl(id),
      ownerId: new FormControl(ownerId),
      projectName: new FormControl(projectName, Validators.required),
      isPaid: new FormControl(isPaid),
      payRate: new FormControl({value: payRate, disabled: !isPaid}),
      isFavorite: new FormControl(isFavorite, Validators.required)});

    this.projectForm.get('isPaid').valueChanges.subscribe(v => {
      if (v) {
        this.projectForm.get('payRate').enable();
      } else {
        this.projectForm.get('payRate').setValue('');
        this.projectForm.get('payRate').disable();
      }
    });
  }

  onSubmit() {
    const project = {} as Project;
    Object.assign(project, this.projectForm.value);
    if (!project.isPaid) {
      project.payRate = null;
    }

    if (this.editMode) {
      this.projectsService.updateProject(project);
    } else {
      this.projectsService.addProject(project);
    }

    this.clearState();
    this.router.navigate(['projects']);
  }

  onSwitchFavorite() {
    const favoriteCheckbox = this.projectForm.get('isFavorite');
    favoriteCheckbox.setValue(!favoriteCheckbox.value);
  }

  onClearForm() {
    if (this.editMode) {
      this.clearState();
      this.router.navigate(['projects']);
    } else {
      this.clearState();
    }
  }

  clearState() {
    this.projectsStore.setActive(null);
    this.initForm(null);
  }

  ngOnDestroy(): void {
    this.projectsStore.setActive(null);
  }

}
