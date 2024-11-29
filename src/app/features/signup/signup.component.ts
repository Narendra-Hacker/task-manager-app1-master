import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user: User = { id: 0, name: '', phoneNo: '', email: '', password: '' };

  constructor(private userService: UserService, private router: Router) {}

  /**
   * Handles the signup process and navigates to login on success.
   */
  onSignup(): void {
    this.userService.addUser(this.user).pipe(
      catchError((error) => {
        console.error('Sign up failed:', error);
        alert('Sign up failed. Please try again.');
        return of(null); // Return a fallback observable to continue execution
      })
    ).subscribe((newUser) => {
      if (newUser) {
        alert('Sign up successful');
        this.router.navigate(['/']); // Navigate to the login page
      }
    });
  }
}
