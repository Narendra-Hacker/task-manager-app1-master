import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../models/Task';

@Pipe({
  name: 'taskStatusFilter'
})
export class TaskStatusFilterPipe implements PipeTransform {
  transform(tasks: Task[], status: string): Task[] {
    if (!tasks || !status) {
      return tasks;
    }
    return tasks.filter(task => task.status === status);
  }
}