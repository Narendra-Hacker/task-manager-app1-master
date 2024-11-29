import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar'; // Import MatToolbarModule
import { RouterTestingModule } from '@angular/router/testing'; // To test navigation functionality

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Create mock objects for the Router and UserService
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserService = jasmine.createSpyObj('UserService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [UserDetailsComponent], // Declare your component
      imports: [
        MatToolbarModule, // Add MatToolbarModule to the imports to recognize mat-toolbar
        RouterTestingModule, // Add RouterTestingModule to test routing logic
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    // Create the component fixture and instance
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Test to check if the component is created successfully
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should navigate to the login page', () => {
      // Test if router navigation to '/login' occurs
      component.logout();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should call the logout method in UserService', () => {
      // Test if the logout method of the UserService is called
      component.logout();
      expect(mockUserService.logout).toHaveBeenCalled();
    });
  });
});
