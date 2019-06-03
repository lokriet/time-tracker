import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksModule } from './tasks/tasks.module';
import { HeaderComponent } from './header/header.component';
import { environment } from '../environments/environment';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/store/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { DatabaseService } from './db.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    TasksModule,
    AuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    environment.production ?
        [] :
        [ AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot() ]
  ],
  providers: [DatabaseService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
