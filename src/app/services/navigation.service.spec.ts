import { TestBed } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';

describe('NavigationService', () => {
  let service: NavigationService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: mockRouter },
      ],
    });
    service = TestBed.inject(NavigationService);
  });

  afterEach(() => {
    localStorage.clear(); // Clear localStorage after each test to ensure isolation
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveCurrentRoute', () => {
    it('should save the current route to localStorage', () => {
      const testRoute = '/test-route';
      service.saveCurrentRoute(testRoute);

      const savedRoute = localStorage.getItem('currentRoute');
      expect(savedRoute).toEqual(testRoute);
    });
  });

  describe('restoreRoute', () => {
    it('should navigate to the saved route if one exists in localStorage', () => {
      const savedRoute = '/saved-route';
      localStorage.setItem('currentRoute', savedRoute);

      service.restoreRoute();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(savedRoute);
    });

    it('should not call navigateByUrl if no route is saved in localStorage', () => {
      service.restoreRoute();
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should handle errors during navigation gracefully', () => {
      const savedRoute = '/error-route';
      localStorage.setItem('currentRoute', savedRoute);

      const consoleSpy = spyOn(console, 'error');
      mockRouter.navigateByUrl.and.throwError('Navigation error');

      service.restoreRoute();

      expect(consoleSpy).toHaveBeenCalledWith('Navigation error:', jasmine.any(Error));
    });
  });
});
