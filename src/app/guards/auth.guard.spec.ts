import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { UserService } from '../services/user.service';
import { NavigationService } from '../services/navigation.service';

describe('authGuard', () => {
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['isAuthenticated']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['saveCurrentRoute']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    });
  });

  it('should allow access if user is authenticated', () => {
    mockUserService.isAuthenticated.and.returnValue(true);

    const canActivate = authGuard({} as any, { url: '/dashboard' } as any);

    expect(mockUserService.isAuthenticated).toHaveBeenCalled();
    expect(mockNavigationService.saveCurrentRoute).toHaveBeenCalledWith('/dashboard');
    expect(canActivate).toBeTrue();
  });

  it('should deny access and navigate to login if user is not authenticated', () => {
    mockUserService.isAuthenticated.and.returnValue(false);

    const canActivate = authGuard({} as any, { url: '/dashboard' } as any);

    expect(mockUserService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(canActivate).toBeFalse();
  });
});
