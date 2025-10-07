import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, Status } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Input() title: string = '';
  @Input() emptyMessage: string = 'No tasks found';
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() updateStatus = new EventEmitter<{id: number, status: Status}>();

  onEditTask(task: Task) {
    this.editTask.emit(task);
  }

  onDeleteTask(id: number) {
    this.deleteTask.emit(id);
  }

  onUpdateStatus(data: {id: number, status: Status}) {
    this.updateStatus.emit(data);
  }

  getTasksByStatus(status: Status): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  get todoTasks(): Task[] {
    return this.getTasksByStatus(Status.TODO);
  }

  get inProgressTasks(): Task[] {
    return this.getTasksByStatus(Status.IN_PROGRESS);
  }

  get doneTasks(): Task[] {
    return this.getTasksByStatus(Status.DONE);
  }
}