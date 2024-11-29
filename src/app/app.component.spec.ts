import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { NavigationService } from './services/navigation.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserService = jasmine.createSpyObj('UserService', ['isAuthenticated']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['restoreRoute']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call restoreRoute if the user is authenticated', () => {
      mockUserService.isAuthenticated.and.returnValue(true);

      component.ngOnInit();

      expect(mockUserService.isAuthenticated).toHaveBeenCalled();
      expect(mockNavigationService.restoreRoute).toHaveBeenCalled();
    });

    it('should not call restoreRoute if the user is not authenticated', () => {
      mockUserService.isAuthenticated.and.returnValue(false);

      component.ngOnInit();

      expect(mockUserService.isAuthenticated).toHaveBeenCalled();
      expect(mockNavigationService.restoreRoute).not.toHaveBeenCalled();
    });
  });
});
