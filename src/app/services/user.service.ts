import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private localStorageKey = 'users';
  private loggedInUserKey = 'loggedInUser';
  private loggedInUser: User | null = null;

  constructor() {
    this.loadLoggedInUser();
  }

  /**
   * Get all users from local storage.
   */
  getUsers(): Observable<User[]> {
    const users = localStorage.getItem(this.localStorageKey);
    return of(users ? (JSON.parse(users) as User[]) : []);
  }

  /**
   * Add a new user to local storage.
   */
  addUser(user: User): Observable<User> {
    return this.getUsers().pipe(
      map((users: User[]) => {
        user.id = this.generateUniqueId(users);
        users.push(user);
        localStorage.setItem(this.localStorageKey, JSON.stringify(users));
        return user;
      }),
      catchError((error: unknown) => throwError(() => new Error(`Failed to add user: ${error}`)))
    );
  }

  /**
   * Authenticate a user by email and password.
   */
  authenticateUser(email: string, password: string): Observable<User | undefined> {
    return this.getUsers().pipe(
      map((users: User[]) => {
        const user = users.find((u: User) => u.email === email && u.password === password);
        if (user) {
          this.loggedInUser = user;
          localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
        }
        return user;
      }),
      catchError((error: unknown) =>
        throwError(() => new Error(`Authentication failed: ${error}`))
      )
    );
  }

  /**
   * Check if a user is authenticated.
   */
  isAuthenticated(): Observable<boolean> {
    return of(this.loggedInUser !== null);
  }

  /**
   * Log out the current user.
   */
  logout(): Observable<void> {
    this.loggedInUser = null;
    localStorage.removeItem(this.loggedInUserKey);
    return of(undefined);
  }

  /**
   * Get the ID of the logged-in user.
   */
  getLoggedInUserId(): Observable<number | null> {
    return of(this.loggedInUser ? this.loggedInUser.id : null);
  }

  /**
   * Load the logged-in user from local storage.
   */
  private loadLoggedInUser(): void {
    const storedUser = localStorage.getItem(this.loggedInUserKey);
    if (storedUser) {
      this.loggedInUser = JSON.parse(storedUser) as User;
    }
  }

  /**
   * Generate a unique ID for a new user.
   */
  private generateUniqueId(users: User[]): number {
    return users.length ? Math.max(...users.map((user: User) => user.id)) + 1 : 1;
  }
}
