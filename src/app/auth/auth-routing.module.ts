import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ], 
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {

}