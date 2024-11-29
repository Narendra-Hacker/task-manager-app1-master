import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { UserDetailsComponent } from './features/user-details/user-details.component';
import { HomeComponent } from './features/home/home.component';
import { TaskListComponent } from './features/task-list/task-list.component';
import { TaskFormComponent } from './features/task-form/task-form.component';
import { TaskStatusFilterPipe } from './features/task-list/task-status-filter.pipe';
import { HighlightTaskDirective } from './features/task-list/highlight-task.directive';

// Angular Forms
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatGridListModule } from '@angular/material/grid-list'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';


// Import NavigationService
import { NavigationService } from './services/navigation.service'; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    TaskListComponent,
    TaskFormComponent,
    TaskStatusFilterPipe,
    HighlightTaskDirective,
    UserDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    //UserDetailsComponent
  ],
  // exports:[UserDetailsComponent],
  providers: [NavigationService,
    provideAnimations()
  ], // Add NavigationService here if desired
  bootstrap: [AppComponent]
})
export class AppModule { } 