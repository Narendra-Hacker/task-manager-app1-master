import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
 selector: 'app-login',
 templateUrl: './login.component.html',
 styleUrls: ['./login.component.css']
})
export class LoginComponent {
 email = '';
 password = '';
 constructor(private userService: UserService, private router: Router) {}
 onLogin() {
   const user = this.userService.authenticateUser(this.email, this.password);
   if (user) {
     alert('Login successful');
     this.router.navigate(['/home']);
   } else {
     alert('Invalid email or password');
   }
 }
}