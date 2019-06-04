import { Component, OnInit, OnDestroy } from '@angular/core';
import { faCheck, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Project } from '../project.model';
import { ProjectsService } from '../store/projects.service';
import { AuthService } from 'src/app/auth/store/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsStore } from '../store/projects.store';
import { ProjectsQuery } from '../store/projects.query';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit, OnDestroy {
  faCheck = faCheck;
  faReload = faSyncAlt;
  
  projectForm: FormGroup;
  editMode: boolean = false;

  constructor(private projectsService: ProjectsService,
              private projectsStore: ProjectsStore,
              private projectsQuery: ProjectsQuery,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.projectsStore.setActive(params['id']);
        const project = this.projectsQuery.getActive();
        if (params['id'] != null && !project) {
          //task not found
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

    this.editMode = (project != null);

    if (this.editMode) {
      ({id, ownerId, projectName, isPaid, payRate} = project);
    }

    this.projectForm = new FormGroup({
      'id': new FormControl(id),
      'ownerId': new FormControl(ownerId),
      'projectName': new FormControl(projectName, Validators.required),
      'isPaid': new FormControl(isPaid),
      'payRate': new FormControl({value: payRate, disabled: !isPaid})});
    
    this.projectForm.get('isPaid').valueChanges.subscribe(v => {
      if (v) {
        this.projectForm.get('payRate').enable();
      } else {
        this.projectForm.get('payRate').disable();
        this.projectForm.get('payRate').setValue("");
      }
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.projectsService.updateProject(this.projectForm.value);
    } else {
      this.projectsService.addProject(this.projectForm.value);
    }

    this.clearState();
  
    this.router.navigate(['projects']);
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
