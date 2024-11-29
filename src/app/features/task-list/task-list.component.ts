import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/Task';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  paginatedTasks: Task[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  pageSizes: number[] = [5, 10, 20];
  selectedStatus: string = ''; 
  private searchSubject: Subject<string> = new Subject<string>();

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
    this.setupSearch();
  }

  /**
   * Load tasks using TaskService and handle the observable response.
   */
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.updatePagination();
      },
      error: (err) => console.error('Failed to load tasks:', err),
    });
  }

  /**
   * Update paginated tasks based on filters and pagination settings.
   */
  updatePagination(): void {
    const filteredTasks = this.filterTasks();
    this.totalPages = Math.ceil(filteredTasks.length / this.pageSize);
    this.paginatedTasks = filteredTasks.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  /**
   * Filter tasks by search term and selected status.
   */
  filterTasks(): Task[] {
    return this.tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedStatus ? task.status === this.selectedStatus : true)
    );
  }

  /**
   * Handle search input change and debounce it using RxJS.
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }
 
  /**
   * Setup RxJS search handling with debounce and distinctUntilChanged operators.
   */
  setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term;
        this.currentPage = 1; 
        this.updatePagination();
      });
  }

  /**
   * Change the current page and update pagination.
   */
  changePage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1; 
    this.updatePagination();
  }

  /**
   * Handle page size change and reset pagination.
   */
  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
    this.currentPage = 1; 
    this.updatePagination();
  }

  /**
   * Handle status filter change and reset pagination.
   */
  onStatusChange(event: MatSelectChange): void {
    this.selectedStatus = event.value; 
    this.currentPage = 1; 
    this.updatePagination();
  }

  /**
   * Toggle task status and update the task using TaskService.
   */
  toggleStatus(task: Task): void {
    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    this.taskService.editTask(task).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
        this.updatePagination();
      },
      error: (err) => console.error('Failed to toggle task status:', err),
    });
  }

  /**
   * Delete a task and reload the task list.
   */
  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to delete task:', err),
    });
  }

  /**
   * Navigate to the task form for adding a new task.
   */
  navigateToAddTask(): void {
    this.router.navigate(['/task-form']);
  }
}
