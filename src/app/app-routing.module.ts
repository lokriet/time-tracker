import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ReportsComponent } from './reports/reports.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'reports', component: ReportsComponent, canActivate: [ AuthGuard ] },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
