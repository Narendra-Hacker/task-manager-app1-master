import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { UserDetailsComponent } from './features/user-details/user-details.component';
import { HomeComponent } from './features/home/home.component';
import { TaskListComponent } from './features/task-list/task-list.component';
import { TaskFormComponent } from './features/task-form/task-form.component';
import { authGuard } from './guards/auth.guard';


const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'user-details',component:UserDetailsComponent, canActivate: [authGuard]},
  { path: 'home', component: HomeComponent, canActivate: [authGuard] }, 
  {path:'task-list',component:TaskListComponent, canActivate: [authGuard]},
  {path:'task-form',component:TaskFormComponent, canActivate: [authGuard]},
  {path:'',redirectTo:'/login',pathMatch:'full'}, 
  { path: '**', redirectTo: '/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
