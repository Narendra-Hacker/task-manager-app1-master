import { TaskStatusFilterPipe } from './task-status-filter.pipe';
import { Task } from '../../models/Task';

describe('TaskStatusFilterPipe', () => {
  let pipe: TaskStatusFilterPipe;

  beforeEach(() => {
    pipe = new TaskStatusFilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all tasks if no status is provided', () => {
    const tasks: Task[] = [
      { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 1 },
      { id: 2, name: 'Task 2', description: '', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: 2 },
    ];
    const result = pipe.transform(tasks, '');
    expect(result).toEqual(tasks);
  });

  it('should return all tasks if status is null or undefined', () => {
    const tasks: Task[] = [
      { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 1 },
      { id: 2, name: 'Task 2', description: '', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: 2 },
    ];
    const resultWithNull = pipe.transform(tasks, null as unknown as string);
    const resultWithUndefined = pipe.transform(tasks, undefined as unknown as string);

    expect(resultWithNull).toEqual(tasks);
    expect(resultWithUndefined).toEqual(tasks);
  });

  it('should return an empty array if the task list is null or undefined', () => {
    const resultWithNull = pipe.transform(null as unknown as Task[], 'Pending');
    const resultWithUndefined = pipe.transform(undefined as unknown as Task[], 'Completed');

    expect(resultWithNull).toEqual([]);
    expect(resultWithUndefined).toEqual([]);
  });

  it('should filter tasks by "Pending" status', () => {
    const tasks: Task[] = [
      { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 1 },
      { id: 2, name: 'Task 2', description: '', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: 2 },
      { id: 3, name: 'Task 3', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 3 },
    ];
    const result = pipe.transform(tasks, 'Pending');
    expect(result).toEqual([
      { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 1 },
      { id: 3, name: 'Task 3', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 3 },
    ]);
  });

  it('should filter tasks by "Completed" status', () => {
    const tasks: Task[] = [
      { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 1 },
      { id: 2, name: 'Task 2', description: '', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: 2 },
    ];
    const result = pipe.transform(tasks, 'Completed');
    expect(result).toEqual([{ id: 2, name: 'Task 2', description: '', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: 2 }]);
  });

  it('should return an empty array if no tasks match the status', () => {
    const tasks: Task[] = [
      { id: 1, name: 'Task 1', description: '', startDate: new Date(), endDate: new Date(), status: 'Pending', userId: 1 },
      { id: 2, name: 'Task 2', description: '', startDate: new Date(), endDate: new Date(), status: 'Completed', userId: 2 },
    ];
    const result = pipe.transform(tasks, 'In Progress');
    expect(result).toEqual([]);
  });
});
