import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Mock dependencies
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTaskService = jasmine.createSpyObj('TaskService', ['addTask']);
    mockUserService = jasmine.createSpyObj('UserService', ['isAuthenticated']);

    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [FormsModule], // Needed for ngModel
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TaskService, useValue: mockTaskService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('calculateDays', () => {
    it('should correctly calculate days between startDate and endDate', () => {
      component.task.startDate = new Date('2024-01-01');
      component.task.endDate = new Date('2024-01-10');
      component.calculateDays();
      expect(component.daysRequired).toBe(9);
    });

    it('should handle cases where startDate equals endDate', () => {
      component.task.startDate = new Date('2024-01-01');
      component.task.endDate = new Date('2024-01-01');
      component.calculateDays();
      expect(component.daysRequired).toBe(0);
    });

    it('should return a negative value if startDate is after endDate', () => {
      component.task.startDate = new Date('2024-01-10');
      component.task.endDate = new Date('2024-01-01');
      component.calculateDays();
      expect(component.daysRequired).toBeLessThan(0);
    });
  });

  describe('onSubmit', () => {
    it('should add a task and navigate if the user is authenticated', () => {
      mockUserService.isAuthenticated.and.returnValue(true);

      component.task = {
        id: 1,
        name: 'Test Task',
        description: 'Task Description',
        startDate: new Date(),
        endDate: new Date(),
        status: 'Pending',
        userId: 1,
      };
      component.onSubmit();

      expect(mockTaskService.addTask).toHaveBeenCalledWith(component.task);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/task-list']);
    });

    it('should not add a task if the user is not authenticated', () => {
      mockUserService.isAuthenticated.and.returnValue(false);

      component.onSubmit();

      expect(mockTaskService.addTask).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('HTML integration', () => {
    it('should bind task name input to the task object', () => {
      const inputElement = fixture.debugElement.query(By.css('input[name="taskName"]')).nativeElement;
      inputElement.value = 'New Task';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.task.name).toBe('New Task');
    });

    it('should call calculateDays when startDate or endDate changes', () => {
      const spy = spyOn(component, 'calculateDays');
      const startDateInput = fixture.debugElement.query(By.css('input[name="startDate"]')).nativeElement;
      startDateInput.value = '2024-01-01';
      startDateInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });

    it('should call onSubmit when the form is submitted', () => {
      const spy = spyOn(component, 'onSubmit');
      const formElement = fixture.debugElement.query(By.css('form')).nativeElement;
      formElement.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });
});
