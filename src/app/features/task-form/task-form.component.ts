import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/Task';
import { of, catchError } from 'rxjs';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  task: Task = {
    id: 0,
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'Pending',
    userId: 0,
  };
  daysRequired: number = 0;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  calculateDays() {
    const start = new Date(this.task.startDate);
    const end = new Date(this.task.endDate);
    const timeDiff = end.getTime() - start.getTime();
    this.daysRequired = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  onSubmit() {
    if (this.userService.isAuthenticated()) {
      this.taskService.addTask(this.task).pipe(
        catchError((error) => {
          console.error('Error adding task:', error);
          this.errorMessage = 'Failed to add task. Please try again later.';
          return of(null); // Return a fallback observable
        })
      ).subscribe((result) => {
        if (result) {
          console.log('Task added successfully:', result);
          this.resetForm();
          this.router.navigate(['/task-list']);
        } else {
          console.error('Task addition failed.');
        }
      });
    } else {
      this.errorMessage = 'User is not authenticated. Task submission failed.';
      console.error(this.errorMessage);
    }
  }

  private resetForm() {
    this.task = {
      id: 0,
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Pending',
      userId: 0,
    };
    this.daysRequired = 0;
    this.errorMessage = null;
  }
}
