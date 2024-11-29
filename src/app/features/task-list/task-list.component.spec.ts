import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { PageEvent } from '@angular/material/paginator';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserDetailsComponent } from '../user-details/user-details.component';  // Import your UserDetailsComponent

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockTasks = [
    { id: 1, name: 'Task 1', description: 'Description 1', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 1 },
    { id: 2, name: 'Task 2', description: 'Description 2', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: 1 },
    { id: 3, name: 'Task 3', description: 'Description 3', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 2 },
  ];

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks', 'editTask', 'deleteTask']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent, UserDetailsComponent], // Declare UserDetailsComponent here
      imports: [FormsModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    mockTaskService.getTasks.and.returnValue(mockTasks);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load tasks and set up search', () => {
      const setupSearchSpy = spyOn(component, 'setupSearch');
      component.ngOnInit();
      expect(component.tasks).toEqual(mockTasks);
      expect(setupSearchSpy).toHaveBeenCalled();
    });
  });

  describe('loadTasks', () => {
    it('should fetch tasks and update pagination', () => {
      const updatePaginationSpy = spyOn(component, 'updatePagination');
      component.loadTasks();
      expect(component.tasks).toEqual(mockTasks);
      expect(updatePaginationSpy).toHaveBeenCalled();
    });
  });

  describe('updatePagination', () => {
    it('should paginate tasks correctly', () => {
      component.pageSize = 2;
      component.currentPage = 1;
      component.updatePagination();
      expect(component.paginatedTasks.length).toBe(2);
      expect(component.paginatedTasks).toEqual(mockTasks.slice(0, 2));

      component.currentPage = 2;
      component.updatePagination();
      expect(component.paginatedTasks.length).toBe(1);
      expect(component.paginatedTasks).toEqual([mockTasks[2]]);
    });
  });

  describe('filterTasks', () => {
    it('should filter tasks by search term', () => {
      component.searchTerm = 'Task 1';
      const filteredTasks = component.filterTasks();
      expect(filteredTasks.length).toBe(1);
      expect(filteredTasks[0].name).toBe('Task 1');
    });

    it('should filter tasks by status', () => {
      component.selectedStatus = 'Completed';
      const filteredTasks = component.filterTasks();
      expect(filteredTasks.length).toBe(1);
      expect(filteredTasks[0].status).toBe('Completed');
    });

    it('should filter tasks by both search term and status', () => {
      component.searchTerm = 'Task 2';
      component.selectedStatus = 'Completed';
      const filteredTasks = component.filterTasks();
      expect(filteredTasks.length).toBe(1);
      expect(filteredTasks[0].name).toBe('Task 2');
    });
  });

  it('should update the search term and trigger search', () => {
    const event = { target: { value: 'Search Term' } } as unknown as Event;
    component.onSearch(event);
    fixture.detectChanges();
    expect(component.searchTerm).toBe('Search Term');
    expect(component.currentPage).toBe(1); // Ensure pagination resets
  });  

  describe('changePage', () => {
    it('should update pagination on page change', () => {
      const updatePaginationSpy = spyOn(component, 'updatePagination');
      const pageEvent = { pageSize: 10, pageIndex: 2 } as PageEvent;
      component.changePage(pageEvent);
      expect(component.pageSize).toBe(10);
      expect(component.currentPage).toBe(3);
      expect(updatePaginationSpy).toHaveBeenCalled();
    });
  });

  describe('toggleStatus', () => {
    it('should toggle task status and update the task', () => {
      const task = mockTasks[0];
      component.toggleStatus(task);
      expect(task.status).toBe('Completed');
      expect(mockTaskService.editTask).toHaveBeenCalledWith(task);

      component.toggleStatus(task);
      expect(task.status).toBe('Pending');
      expect(mockTaskService.editTask).toHaveBeenCalledWith(task);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and reload tasks', () => {
      const loadTasksSpy = spyOn(component, 'loadTasks');
      component.deleteTask(1);
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
      expect(loadTasksSpy).toHaveBeenCalled();
    });
  });

  describe('navigateToAddTask', () => {
    it('should navigate to the add task form', () => {
      component.navigateToAddTask();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/task-form']);
    });
  });
});
