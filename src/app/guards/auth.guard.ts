import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NavigationService } from '../services/navigation.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const navigationService = inject(NavigationService);
  if (userService.isAuthenticated()) {
    navigationService.saveCurrentRoute(state.url);
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};