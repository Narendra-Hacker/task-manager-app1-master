import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { NavigationService } from './services/navigation.service';
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 constructor(
   private router: Router,
   private userService: UserService,
   private navigationService: NavigationService
 ) {}
 ngOnInit(): void {
   if (this.userService.isAuthenticated()) {
     this.navigationService.restoreRoute();
   }
 }
}