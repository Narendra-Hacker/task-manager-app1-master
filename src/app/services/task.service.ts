import { Injectable } from '@angular/core';
import { Task } from '../models/Task';
import { UserService } from './user.service';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private localStorageKey = 'tasks';

  constructor(private userService: UserService) {}

  /**
   * Get tasks for the currently logged-in user.
   */
  getTasks(): Observable<Task[]> {
    return this.userService.getLoggedInUserId().pipe(
      switchMap((userId) => {
        if (userId === null) {
          return throwError(() => new Error('User not logged in'));
        }
        return this.getAllTasks().pipe(
          map((tasks) => tasks.filter((task) => task.userId === userId))
        );
      }),
      catchError((error: unknown) => throwError(() => new Error(`Failed to get tasks: ${error}`)))
    );
  }

  /**
   * Get all tasks from local storage.
   */
  getAllTasks(): Observable<Task[]> {
    const tasks = localStorage.getItem(this.localStorageKey);
    const allTasks = tasks ? JSON.parse(tasks) : [];
    return of(allTasks);
  }

  /**
   * Add a new task to local storage.
   */
  addTask(task: Task): Observable<Task> {
    return this.userService.getLoggedInUserId().pipe(
      switchMap((userId) => {
        if (userId === null) {
          return throwError(() => new Error('User not logged in. Cannot add task.'));
        }
        return this.getAllTasks().pipe(
          map((allTasks) => {
            task.id = this.generateUniqueId(allTasks);
            task.userId = userId;
            allTasks.push(task);
            localStorage.setItem(this.localStorageKey, JSON.stringify(allTasks));
            return task;
          })
        );
      }),
      catchError((error: unknown) => throwError(() => new Error(`Failed to add task: ${error}`)))
    );
  }

  /**
   * Delete a task by its ID.
   */
  deleteTask(taskId: number): Observable<void> {
    return this.getAllTasks().pipe(
      map((tasks) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));
      }),
      catchError((error: unknown) =>
        throwError(() => new Error(`Failed to delete task: ${error}`))
      )
    );
  }

  /**
   * Edit an existing task.
   */
  editTask(updatedTask: Task): Observable<Task> {
    return this.getAllTasks().pipe(
      map((tasks) => {
        const taskIndex = tasks.findIndex((task) => task.id === updatedTask.id);
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }
        updatedTask.userId = tasks[taskIndex].userId; // Ensure userId remains unchanged
        tasks[taskIndex] = updatedTask;
        localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
        return updatedTask;
      }),
      catchError((error: unknown) =>
        throwError(() => new Error(`Failed to edit task: ${error}`))
      )
    );
  }

  /**
   * Find a task by its name.
   */
  findTaskByName(name: string): Observable<Task | undefined> {
    return this.getAllTasks().pipe(
      map((tasks) => tasks.find((task) => task.name === name))
    );
  }

  /**
   * Find a task by its ID.
   */
  findTaskById(id: number): Observable<Task | undefined> {
    return this.getAllTasks().pipe(
      map((tasks) => tasks.find((task) => task.id === id))
    );
  }

  /**
   * Generate a unique ID for a new task.
   */
  private generateUniqueId(tasks: Task[]): number {
    if (tasks.length === 0) {
      return 1;
    }
    const maxId = Math.max(...tasks.map((task) => task.id));
    return maxId + 1;
  }
}
