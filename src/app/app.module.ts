import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksModule } from './tasks/tasks.module';
import { HeaderComponent } from './header/header.component';
import { environment } from '../environments/environment';
import { PageNotFoundComponent } from './page-not-found.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    TasksModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    environment.production ?
        [] :
        [ AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot() ]
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
