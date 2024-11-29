import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { UserService } from './user.service';
import { Task } from '../models/Task';

describe('TaskService', () => {
  let service: TaskService;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockUserId = 1;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getLoggedInUserId']);
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: UserService, useValue: mockUserService },
      ],
    });
    service = TestBed.inject(TaskService);
  });

  afterEach(() => {
    localStorage.clear(); // Clean up after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should return tasks belonging to the logged-in user', () => {
      const tasks: Task[] = [
        { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: mockUserId },
        { id: 2, name: 'Task 2', description: '', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: 2 },
      ];
      localStorage.setItem('tasks', JSON.stringify(tasks));
      mockUserService.getLoggedInUserId.and.returnValue(mockUserId);

      const result = service.getTasks();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
    });

    it('should return an empty array if no tasks exist', () => {
      mockUserService.getLoggedInUserId.and.returnValue(mockUserId);
      const result = service.getTasks();
      expect(result).toEqual([]);
    });
  });

  describe('addTask', () => {
    it('should add a task for the logged-in user', () => {
      mockUserService.getLoggedInUserId.and.returnValue(mockUserId);
      const newTask: Task = { id: 0, name: 'New Task', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 0 };

      service.addTask(newTask);
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      expect(tasks.length).toBe(1);
      expect(tasks[0].name).toBe('New Task');
      expect(tasks[0].userId).toBe(mockUserId);
    });

    it('should throw an error if user is not logged in', () => {
      mockUserService.getLoggedInUserId.and.returnValue(null);

      expect(() => service.addTask({ id: 0, name: '', description: '', startDate: new Date(), endDate: new Date(), status: '', userId: 0 }))
        .toThrowError('User  is not logged in. Cannot add task.');
    });
  });

  describe('deleteTask', () => {
    it('should delete the task by ID', () => {
      const tasks: Task[] = [
        { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: mockUserId },
        { id: 2, name: 'Task 2', description: '', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: mockUserId },
      ];
      localStorage.setItem('tasks', JSON.stringify(tasks));

      service.deleteTask(1);
      const remainingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      expect(remainingTasks.length).toBe(1);
      expect(remainingTasks[0].id).toBe(2);
    });
  });

  describe('editTask', () => {
    it('should edit an existing task', () => {
      const tasks: Task[] = [
        { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: mockUserId },
      ];
      localStorage.setItem('tasks', JSON.stringify(tasks));
      const updatedTask: Task = { id: 1, name: 'Updated Task', description: 'Updated', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: mockUserId };

      service.editTask(updatedTask);
      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      expect(storedTasks[0].name).toBe('Updated Task');
      expect(storedTasks[0].status).toBe('Completed');
    });

    it('should do nothing if the task ID does not exist', () => {
      const tasks: Task[] = [
        { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: mockUserId },
      ];
      localStorage.setItem('tasks', JSON.stringify(tasks));
      const nonExistentTask: Task = { id: 99, name: 'Non-existent Task', description: '', startDate: new Date(), endDate: new Date(), status: '', userId: mockUserId };

      service.editTask(nonExistentTask);
      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      expect(storedTasks).toEqual(tasks);
    });
  });

  describe('findTaskByName', () => {
    it('should find a task by its name', () => {
      const tasks: Task[] = [
        { id: 1, name: 'Find Me', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: mockUserId },
      ];
      localStorage.setItem('tasks', JSON.stringify(tasks));

      const task = service.findTaskByName('Find Me');
      expect(task).toBeDefined();
      expect(task?.name).toBe('Find Me');
    });
  });

  describe('findTaskById', () => {
    it('should find a task by its ID', () => {
      const tasks: Task[] = [
        { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: mockUserId },
      ];
      localStorage.setItem('tasks', JSON.stringify(tasks));

      const task = service.findTaskById(1);
      expect(task).toBeDefined();
      expect(task?.id).toBe(1);
    });
  });
});
